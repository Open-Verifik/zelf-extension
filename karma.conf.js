// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        autoWatch: true,
        basePath: "",
        browserDisconnectTimeout: 10000,
        browserNoActivityTimeout: 30000,
        browsers: ["Chrome"],
        colors: true,
        failOnFailingTestSuite: true,
        // Set to ERROR level to hide the WARN messages about failed proxies
        logLevel: config.LOG_ERROR,
        port: 9876,
        reporters: ["progress", "kjhtml"],
        restartOnFileChange: true,
        singleRun: false,
        frameworks: ["jasmine", "@angular-devkit/build-angular"],
        plugins: [
            require("karma-jasmine"),
            require("karma-chrome-launcher"),
            require("karma-jasmine-html-reporter"),
            require("karma-coverage"),
            require("@angular-devkit/build-angular/plugins/karma"),
        ],
        files: [{ pattern: "src/assets/**/*", watched: true, served: true, included: false }],
        proxies: {
            "/assets/": "/base/src/assets/",
        },
        client: {
            jasmine: {},
            clearContext: false,
            captureConsole: false,
        },
        jasmineHtmlReporter: {
            suppressAll: true,
        },
        coverageReporter: {
            dir: require("path").join(__dirname, "./coverage"),
            subdir: ".",
            reporters: [{ type: "html" }, { type: "text-summary" }, { type: "lcov" }],
            check: {
                global: {
                    statements: 80,
                    branches: 80,
                    functions: 80,
                    lines: 80,
                },
            },
        },
        customLaunchers: {
            ChromeHeadlessCI: {
                base: "ChromeHeadless",
                flags: ["--no-sandbox"],
            },
        },
    });
};
