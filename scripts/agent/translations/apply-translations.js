#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const argv = process.argv.slice(2);
const FLAG_AGENT = argv.includes("--i-am-an-agent");
const FLAG_VERBOSE = argv.includes("--verbose");
const FLAG_DRY_RUN = argv.includes("--dry-run");
const LANG_FLAG_INDEX = argv.indexOf("--lang");
const TARGET_LANG = LANG_FLAG_INDEX !== -1 ? argv[LANG_FLAG_INDEX + 1] : null;

const REPO_ROOT = findRepoRoot();
const TRANSLATIONS_DIR = path.join(REPO_ROOT, "src", "assets", "i18n");
const MISSING_TRANSLATIONS_FILE = path.join(__dirname, "missing-translations.json");

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
};

const colorize = (text, color) => `${colors[color] || ""}${text}${colors.reset}`;

function findRepoRoot() {
    let current = __dirname;
    while (current !== path.parse(current).root) {
        if (fs.existsSync(path.join(current, "angular.json"))) return current;
        current = path.dirname(current);
    }
    return process.cwd();
}

function loadJson(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
        console.error(colorize(`Failed loading ${filePath}: ${e.message}`, "red"));
        return null;
    }
}

function saveJson(filePath, data) {
    if (FLAG_DRY_RUN) {
        if (FLAG_VERBOSE) console.log(colorize(`[dry-run] Would write ${filePath}`, "blue"));
        return true;
    }
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        return true;
    } catch (e) {
        console.error(colorize(`Failed saving ${filePath}: ${e.message}`, "red"));
        return false;
    }
}

function setValueByPath(obj, pathKey, value) {
    const parts = pathKey.split(".");
    const last = parts.pop();
    const parent = parts.reduce((acc, p) => {
        if (!acc[p] || typeof acc[p] !== "object") acc[p] = {};
        return acc[p];
    }, obj);
    parent[last] = value;
}

function ensureAgentFlag() {
    if (FLAG_AGENT) return;
    console.log(colorize("🚨 AI Agent Required", "red"));
    console.log(colorize("===================\n", "red"));
    console.log("This script is designed to be run by an AI Agent to ensure proper translation");
    console.log("workflow and prevent accidental manual execution that could cause issues.\n");
    console.log("To run this script, provide the following prompt to your IDE's AI agent:\n");
    console.log(colorize("────────────────────────────────────────────────────────────────────────────────", "cyan"));
    console.log(colorize("Hi, can you run `npm run apply-translations -- --i-am-an-agent` from the", "yellow"));
    console.log(colorize("zelf-extension project and follow the instructions output by the script?", "yellow"));
    console.log(colorize("────────────────────────────────────────────────────────────────────────────────\n", "cyan"));
    console.log("The AI agent will:");
    console.log(colorize("  ✓ Validate translated content in missing-translations.json", "green"));
    console.log(colorize("  ✓ Apply translations to all language files", "green"));
    console.log(colorize("  ✓ Update files safely with proper formatting", "green"));
    console.log(colorize("  ✓ Clean up the missing-translations.json file", "green"));
    console.log(colorize("\n💡 This approach ensures:", "blue"));
    console.log("  • Safe batch application of translations");
    console.log("  • Proper validation before applying");
    console.log("  • Consistent file formatting");
    console.log("  • Reduced chance of human error\n");
    process.exit(0);
}

function validate(missingTranslationsData) {
    const issues = [];
    const englishIndicators = ["Password", "Failed", "Address", "Domain", "Verify", "Wallet"];

    for (const [lang, entries] of Object.entries(missingTranslationsData.missingTranslations || {})) {
        for (const [key, value] of Object.entries(entries)) {
            if (typeof value !== "string") continue;
            if (englishIndicators.some((w) => value.includes(w)) && lang !== "en") {
                issues.push(`${lang}.${key}: appears untranslated`);
            }
            if (value.trim() === "" || /\[TO TRANSLATE]/i.test(value)) {
                issues.push(`${lang}.${key}: empty or placeholder`);
            }
        }
    }
    return issues;
}

function main() {
    ensureAgentFlag();
    console.log(colorize("🚀 Applying Translations", "cyan"));
    console.log(colorize("========================\n", "cyan"));

    if (TARGET_LANG) {
        console.log(colorize(`🎯 Target language: ${TARGET_LANG}`, "magenta"));
    }

    if (!fs.existsSync(MISSING_TRANSLATIONS_FILE)) {
        console.log(colorize("No missing-translations.json found. Run check first.", "yellow"));
        process.exit(1);
    }

    const data = loadJson(MISSING_TRANSLATIONS_FILE);
    if (!data || !data.missingTranslations || !Object.keys(data.missingTranslations).length) {
        console.log(colorize("Nothing to apply. File empty or invalid.", "yellow"));
        process.exit(0);
    }

    // Filter to target language if specified
    let languagesToProcess = Object.entries(data.missingTranslations);
    if (TARGET_LANG) {
        languagesToProcess = languagesToProcess.filter(([lang]) => lang === TARGET_LANG);
        if (languagesToProcess.length === 0) {
            console.log(colorize(`❌ Language '${TARGET_LANG}' not found in missing translations.`, "red"));
            console.log(colorize(`Available languages: ${Object.keys(data.missingTranslations).join(", ")}`, "yellow"));
            process.exit(1);
        }
    }

    const issues = validate(data);
    if (issues.length) {
        const relevantIssues = TARGET_LANG ? issues.filter((i) => i.startsWith(TARGET_LANG + ".")) : issues;
        if (relevantIssues.length) {
            console.log(colorize("⚠ Validation warnings:", "yellow"));
            relevantIssues.forEach((i) => console.log(colorize(`  - ${i}`, "yellow")));
            console.log(colorize("Proceeding...\n", "yellow"));
        }
    }

    let totalApplied = 0;
    let languagesUpdated = 0;

    for (const [lang, entries] of languagesToProcess) {
        const langFilePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
        const langFileData = loadJson(langFilePath);
        if (!langFileData) {
            console.log(colorize(`Skipping ${lang} (file missing)`, "red"));
            continue;
        }

        let applied = 0;
        for (const [key, value] of Object.entries(entries)) {
            setValueByPath(langFileData, key, value);
            applied++;
        }
        if (saveJson(langFilePath, langFileData)) {
            console.log(colorize(`✅ ${lang}: applied ${applied} translations`, "green"));
            totalApplied += applied;
            languagesUpdated++;
        } else {
            console.log(colorize(`❌ ${lang}: failed to save`, "red"));
        }
    }

    // Update missing-translations.json - remove processed languages
    if (!FLAG_DRY_RUN) {
        const remainingTranslations = { ...data.missingTranslations };
        for (const [lang] of languagesToProcess) {
            delete remainingTranslations[lang];
        }

        const cleaned = {
            metadata: {
                ...data.metadata,
                totalLanguages: Object.keys(remainingTranslations).length,
                totalMissingKeys: Object.values(remainingTranslations).reduce((sum, entries) => sum + Object.keys(entries).length, 0),
            },
            missingTranslations: remainingTranslations,
        };
        saveJson(MISSING_TRANSLATIONS_FILE, cleaned);
    }

    console.log(colorize("\n📋 SUMMARY", "cyan"));
    console.log(colorize("==========", "cyan"));
    console.log(colorize(`Languages updated: ${languagesUpdated}`, "blue"));
    console.log(colorize(`Total keys applied: ${totalApplied}`, "blue"));

    const remainingCount = Object.keys(data.missingTranslations).length - languagesUpdated;
    if (remainingCount > 0 && !FLAG_DRY_RUN) {
        console.log(colorize(`Languages remaining: ${remainingCount}`, "yellow"));
    }

    if (FLAG_DRY_RUN) {
        console.log(colorize("(dry-run) No files were actually written.", "yellow"));
    } else if (totalApplied) {
        console.log(colorize("✅ Translations applied.", "green"));
        if (remainingCount > 0) {
            console.log(colorize("Run again with --lang <code> to translate remaining languages.", "cyan"));
        } else {
            console.log(colorize("Run: npm run check-translations -- --i-am-an-agent to verify.", "cyan"));
        }
    } else {
        console.log(colorize("⚠ No translations applied.", "yellow"));
    }
}

if (require.main === module) {
    main();
}

module.exports = { applyTranslations: main };
