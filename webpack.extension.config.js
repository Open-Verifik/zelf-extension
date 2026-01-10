const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
    // Default output path - will be overridden by Angular builder
    const outputPath = process.env.WEBPACK_OUTPUT_PATH || path.resolve(__dirname, "dist/extension-scripts");
    const isDevelopment = process.env.NODE_ENV === "development" || argv.mode === "development";
    const buildMode = process.env.NODE_ENV || argv.mode || "production";

    return {
        mode: buildMode,
        entry: {
            autofill: "./content-scripts/autofill/autofill.ts",
            background: "./background-scripts/background.ts",
        },
        output: {
            path: outputPath,
            filename: "[name].js",
            clean: false, // Don't clean when integrated with Angular
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            configFile: path.resolve(__dirname, "tsconfig.extension.json"),
                            onlyCompileBundledFiles: true,
                        },
                    },
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"],
            alias: {
                "@extension-scripts": path.resolve(__dirname, "extension-scripts"),
                "@shared": path.resolve(__dirname, "shared"),
            },
        },
        plugins: [
            // Only replace environment.ts with environment.dev.ts in development mode
            // In production (default), environment.ts uses environment.prod.ts (no replacement needed)
            ...(isDevelopment
                ? [
                      new webpack.NormalModuleReplacementPlugin(
                          /extension-scripts\/environments\/environment\.ts$/,
                          path.resolve(__dirname, "extension-scripts/environments/environment.dev.ts")
                      ),
                  ]
                : []),
        ],
        optimization: {
            minimize: buildMode === "production",
            minimizer:
                buildMode === "production"
                    ? [
                          new (require("terser-webpack-plugin"))({
                              terserOptions: {
                                  compress: {
                                      drop_console: false,
                                      drop_debugger: true,
                                      pure_funcs: ["console.debug"], // Remove console.debug calls
                                  },
                                  mangle: {
                                      safari10: true,
                                  },
                                  format: {
                                      comments: false, // Remove comments
                                  },
                              },
                              extractComments: false,
                          }),
                      ]
                    : [],
        },
        target: "webworker",
        devtool: buildMode === "production" ? "source-map" : "inline-source-map",
    };
};
