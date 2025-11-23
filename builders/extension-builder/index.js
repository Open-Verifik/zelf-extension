const { createBuilder, targetFromTargetString } = require("@angular-devkit/architect");
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const { execSync, spawn } = require("child_process");

// ANSI color codes
const COLORS = {
    TEAL: "\x1b[36m",
    GREEN: "\x1b[32m",
    RED: "\x1b[31m",
    YELLOW: "\x1b[33m",
    RESET: "\x1b[0m",
};

// Logging utilities
const log = {
    info: (msg) => console.log(`${COLORS.TEAL}[zelf]${COLORS.RESET} ${msg}`),
    success: (msg) => console.log(`${COLORS.TEAL}[zelf]${COLORS.RESET} ${COLORS.GREEN}✅ ${msg}${COLORS.RESET}`),
    error: (msg) => console.error(`${COLORS.TEAL}[zelf]${COLORS.RESET} ${COLORS.RED}❌ ${msg}${COLORS.RESET}`),
    warn: (msg) => console.warn(`${COLORS.TEAL}[zelf]${COLORS.RESET} ${COLORS.YELLOW}⚠️ ${msg}${COLORS.RESET}`),
};

// Builder options schema
const builderOptionsSchema = {
    $schema: "http://json-schema.org/schema",
    type: "object",
    properties: {
        webpackConfig: { type: "string", description: "Path to webpack configuration file", default: "webpack.extension.config.js" },
        angularTarget: { type: "string", description: "Angular build target to run after webpack" },
        watch: { type: "boolean", description: "Enable watch mode", default: false },
        mode: { type: "string", description: "Build mode (development/production)", enum: ["development", "production"], default: "development" },
    },
    required: ["angularTarget"],
    additionalProperties: false,
};

function createWebpackConfig(options, context, outputPath) {
    const configPath = path.resolve(context.workspaceRoot, options.webpackConfig || "webpack.extension.config.js");

    if (!fs.existsSync(configPath)) {
        throw new Error(`Webpack config not found at: ${configPath}`);
    }

    // Clear require cache and load config
    delete require.cache[require.resolve(configPath)];
    let config = require(configPath);

    // Handle function-style webpack configs
    // Pass mode to webpack config function (defaults to production)
    const webpackMode = options.mode || "production";

    if (typeof config === "function") {
        config = config({}, { mode: webpackMode });
    }

    // Configure output and environment
    config.output = config.output || {};
    config.output.path = outputPath;
    config.mode = webpackMode;
    process.env.NODE_ENV = webpackMode;

    return config;
}

function createAngularProcess(targetSpec, context) {
    return spawn("ng", ["build", "--watch", "--configuration", targetSpec.configuration], {
        cwd: context.workspaceRoot,
        stdio: ["inherit", "pipe", "inherit"],
        env: { ...process.env, FORCE_COLOR: "1", NO_COLOR: "" },
    });
}

function runAngularBuildSync(targetSpec, context) {
    return new Promise((resolve, reject) => {
        try {
            execSync(`ng build --configuration ${targetSpec.configuration}`, {
                stdio: "inherit",
                cwd: context.workspaceRoot,
                env: { ...process.env, FORCE_COLOR: "1", NO_COLOR: "" },
            });
            log.success("Angular build completed!");
            resolve({ success: true });
        } catch (error) {
            log.error(`Angular build failed: ${error.message}`);
            reject(error);
        }
    });
}

function runWebpack(config) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(config);

        compiler.run((err, stats) => {
            if (err) return reject(err);

            if (stats.hasErrors()) {
                const errors = stats.toJson().errors;
                return reject(new Error(`Webpack compilation errors:\n${errors.map((e) => e.message).join("\n")}`));
            }

            if (stats.hasWarnings()) {
                const warnings = stats.toJson().warnings;
                log.warn(`Webpack compilation warnings:\n${warnings.map((w) => w.message).join("\n")}`);
            }

            log.success("Extension scripts compiled successfully");
            resolve({ success: true });
        });
    });
}

function watchWebpack(config, onRebuild) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(config);
        let isFirstBuild = true;

        const watcher = compiler.watch({ aggregateTimeout: 300, poll: undefined, ignored: /node_modules/ }, (err, stats) => {
            if (err) {
                if (isFirstBuild) return reject(err);
                log.error(`Webpack watch error: ${err.message}`);
                return;
            }

            if (stats.hasErrors()) {
                const errors = stats.toJson().errors;
                log.error(`Webpack compilation errors:\n${errors.map((e) => e.message).join("\n")}`);
                if (isFirstBuild) return reject(new Error(`Webpack compilation errors:\n${errors.map((e) => e.message).join("\n")}`));
                return;
            }

            if (stats.hasWarnings()) {
                const warnings = stats.toJson().warnings;
                log.warn(`Webpack compilation warnings:\n${warnings.map((w) => w.message).join("\n")}`);
            }

            log.success("Extension scripts compiled successfully");

            if (isFirstBuild) {
                isFirstBuild = false;
                resolve({ success: true, watcher });
            } else {
                onRebuild();
            }
        });
    });
}

function detectBuildCompletion(output) {
    return (
        (output.includes("✔") && (output.includes("bundle generation complete") || output.includes("compilation complete"))) ||
        (output.includes("✔") && output.includes("Index html generation complete")) ||
        output.includes("Build at:")
    );
}

function setupAngularWatcher(angularWatch, webpackConfig) {
    let initialAngularBuildComplete = false;
    let webpackWatcher = null;

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
        if (initialAngularBuildComplete) return;

        log.warn("Angular build detection timeout, starting webpack fallback");
        initialAngularBuildComplete = true;
        startWebpackWatch();
    }, 15000);

    const startWebpackWatch = () => {
        runWebpack(webpackConfig)
            .then(() => {
                log.info("Webpack watch starting...");
                return watchWebpack(webpackConfig, () => {});
            })
            .then(({ watcher }) => {
                webpackWatcher = watcher;
                log.success("Watch mode active!");
            })
            .catch((error) => log.error(`Webpack setup failed: ${error.message}`));
    };

    // Monitor Angular output for completion
    angularWatch.stdout.on("data", (data) => {
        const output = data.toString();
        const buildComplete = detectBuildCompletion(output);

        if (buildComplete && !initialAngularBuildComplete) {
            clearTimeout(fallbackTimeout);
            initialAngularBuildComplete = true;
            startWebpackWatch();
        } else if (buildComplete && initialAngularBuildComplete) {
            runWebpack(webpackConfig).catch((error) => log.error(`Webpack re-run failed: ${error.message}`));
        }
    });

    // Handle process exit
    angularWatch.on("close", (code) => {
        if (code !== 0) log.error(`Angular watch process exited with code ${code}`);
    });

    // Cleanup on exit
    process.on("SIGINT", () => {
        if (webpackWatcher) webpackWatcher.close();
        angularWatch.kill();
        process.exit(0);
    });

    return webpackWatcher;
}

async function handleWatchMode(targetSpec, context, webpackConfig) {
    const angularWatch = createAngularProcess(targetSpec, context);
    setupAngularWatcher(angularWatch, webpackConfig);
    return new Promise(() => {}); // Keep running indefinitely
}

async function handleBuildMode(targetSpec, context, webpackConfig) {
    await runAngularBuildSync(targetSpec, context);
    await runWebpack(webpackConfig);
    return { success: true };
}

// Main builder export
module.exports = createBuilder((options, context) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Parse target and setup
            const targetSpec = targetFromTargetString(options.angularTarget);
            const angularTarget = await context.getTargetOptions(targetSpec);
            const outputPath = path.resolve(context.workspaceRoot, angularTarget.outputPath);

            // Set environment - default to production if not specified
            process.env.NODE_ENV = options.mode || "production";
            process.env.WEBPACK_OUTPUT_PATH = outputPath;

            // Create webpack config
            const webpackConfig = createWebpackConfig(options, context, outputPath);

            // Execute based on mode
            const result = options.watch
                ? await handleWatchMode(targetSpec, context, webpackConfig)
                : await handleBuildMode(targetSpec, context, webpackConfig);

            resolve(result);
        } catch (error) {
            log.error(`Extension builder failed: ${error.message}`);
            reject({ success: false, error: error.message });
        }
    });
});

module.exports.schema = builderOptionsSchema;
