#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const argv = process.argv.slice(2);
const FLAG_AGENT = argv.includes("--i-am-an-agent");
const FLAG_VERBOSE = argv.includes("--verbose");
const FLAG_DRY_RUN = argv.includes("--dry-run");

const REPO_ROOT = findRepoRoot();
const TRANSLATIONS_DIR = path.join(REPO_ROOT, "src", "assets", "i18n");
const MASTER_FILE = "en.json";
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
    // Walk up until package.json with angular.json found
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
        console.error(colorize(`Failed to read ${filePath}: ${e.message}`, "red"));
        return null;
    }
}

function saveJson(filePath, data) {
    if (FLAG_DRY_RUN) {
        logVerbose(`[dry-run] Would save ${filePath}`);
        return true;
    }
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        return true;
    } catch (e) {
        console.error(colorize(`Failed to write ${filePath}: ${e.message}`, "red"));
        return false;
    }
}

function getAllKeys(obj, prefix = "") {
    let keys = [];
    for (const [k, v] of Object.entries(obj)) {
        const full = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === "object" && !Array.isArray(v)) {
            keys = keys.concat(getAllKeys(v, full));
        } else {
            keys.push(full);
        }
    }
    return keys;
}

function getValue(obj, pathKey) {
    return pathKey.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

function deleteValue(obj, pathKey) {
    const parts = pathKey.split(".");
    const last = parts.pop();
    const parent = parts.reduce((acc, p) => (acc ? acc[p] : undefined), obj);
    if (parent && Object.prototype.hasOwnProperty.call(parent, last)) {
        delete parent[last];
        if (Object.keys(parent).length === 0 && parts.length) {
            deleteValue(obj, parts.join("."));
        }
    }
}

function getLanguageFiles() {
    if (!fs.existsSync(TRANSLATIONS_DIR)) {
        console.error(colorize(`Translations dir not found: ${TRANSLATIONS_DIR}`, "red"));
        process.exit(1);
    }
    return fs
        .readdirSync(TRANSLATIONS_DIR)
        .filter((f) => f.endsWith(".json"))
        .filter((f) => f !== MASTER_FILE)
        .map((f) => ({ code: f.replace(".json", ""), file: f, path: path.join(TRANSLATIONS_DIR, f) }));
}

function buildLanguageNamesMap(codes) {
    const base = {
        ar: "Arabic",
        br: "Portuguese (Brazil)",
        cn: "Chinese (Simplified)",
        en: "English",
        es: "Spanish",
        fr: "French",
        in: "Hindi (India)",
        ja: "Japanese",
        kr: "Korean",
        ph: "Filipino (Tagalog)",
        ru: "Russian",
        th: "Thai",
        ur: "Urdu",
    };
    const map = {};
    for (const c of codes) map[c] = base[c] || c.toUpperCase();
    return map;
}

function logVerbose(msg) {
    if (FLAG_VERBOSE) console.log(colorize(`[verbose] ${msg}`, "blue"));
}

function ensureAgentFlag() {
    if (FLAG_AGENT) return;
    console.log(colorize("🚨 AI Agent Required", "red"));
    console.log(colorize("===================\n", "red"));
    console.log("This script is designed to be run by an AI Agent to ensure proper translation");
    console.log("workflow and prevent accidental manual execution that could cause issues.\n");
    console.log("To run this script, provide the following prompt to your IDE's AI agent:\n");
    console.log(colorize("────────────────────────────────────────────────────────────────────────────────", "cyan"));
    console.log(colorize("Hi, can you run `npm run check-translations -- --i-am-an-agent` from the", "yellow"));
    console.log(colorize("zelf-extension project and follow the instructions output by the script?", "yellow"));
    console.log(colorize("────────────────────────────────────────────────────────────────────────────────\n", "cyan"));
    console.log("The AI agent will:");
    console.log(colorize("  ✓ Analyze translation files for missing or excess keys", "green"));
    console.log(colorize("  ✓ Clean up any inconsistencies automatically", "green"));
    console.log(colorize("  ✓ Generate proper translation instructions if needed", "green"));
    console.log(colorize("  ✓ Provide next steps for completing translations", "green"));
    console.log(colorize("\n💡 This approach ensures:", "blue"));
    console.log("  • Consistent translation workflow");
    console.log("  • Proper handling of missing translations");
    console.log("  • AI-assisted translation quality");
    console.log("  • Reduced chance of human error\n");
    process.exit(0);
}

function main() {
    ensureAgentFlag();
    console.log(colorize("🔍 Translation Audit", "cyan"));
    console.log(colorize("====================\n", "cyan"));

    const masterPath = path.join(TRANSLATIONS_DIR, MASTER_FILE);
    const masterData = loadJson(masterPath);
    if (!masterData) {
        console.error(colorize("Master (en.json) missing or invalid.", "red"));
        process.exit(1);
    }
    const masterKeys = getAllKeys(masterData);
    console.log(colorize(`Master file ${MASTER_FILE} keys: ${masterKeys.length}`, "blue"));

    const languageFiles = getLanguageFiles();
    if (!languageFiles.length) {
        console.log(colorize("No language files found.", "yellow"));
        return;
    }
    console.log(colorize(`Detected languages: ${languageFiles.map((l) => l.code).join(", ")}`, "magenta"));

    const languageNames = buildLanguageNamesMap(languageFiles.map((l) => l.code));

    const globalStats = {
        totalFilesProcessed: 0,
        totalMissingKeys: 0,
        totalExcessKeys: 0,
        totalKeysRemoved: 0,
        filesModified: [],
    };

    const missingByLang = {};

    for (const lang of languageFiles) {
        console.log(colorize(`\n🔎 ${lang.file}`, "cyan"));
        const data = loadJson(lang.path);
        if (!data) continue;

        const langKeys = getAllKeys(data);

        const excessKeys = langKeys.filter((k) => !masterKeys.includes(k));
        const missingKeys = masterKeys.filter((k) => {
            const v = getValue(data, k);
            return v === undefined || v === null || v === "";
        });

        console.log(colorize(`  Keys: ${langKeys.length}`, "blue"));
        console.log(colorize(`  Missing: ${missingKeys.length}`, "yellow"));
        console.log(colorize(`  Excess: ${excessKeys.length}`, "red"));

        if (missingKeys.length) {
            missingByLang[lang.code] = missingKeys;
            globalStats.totalMissingKeys += missingKeys.length;
        }
        if (excessKeys.length) {
            console.log(colorize(`  Removing ${excessKeys.length} excess keys`, "red"));
            const copy = JSON.parse(JSON.stringify(data));
            excessKeys.forEach((ek) => deleteValue(copy, ek));
            if (!FLAG_DRY_RUN && saveJson(lang.path, copy)) {
                globalStats.filesModified.push(lang.file);
                globalStats.totalKeysRemoved += excessKeys.length;
                console.log(colorize(`  Cleaned ${lang.file}`, "green"));
            } else if (FLAG_DRY_RUN) {
                globalStats.filesModified.push(lang.file);
            }
            globalStats.totalExcessKeys += excessKeys.length;
        } else {
            console.log(colorize("  No excess keys", "green"));
        }

        globalStats.totalFilesProcessed++;
    }

    // Build missing translations file
    if (Object.keys(missingByLang).length) {
        const out = {
            metadata: {
                generatedAt: new Date().toISOString(),
                totalLanguages: Object.keys(missingByLang).length,
                totalMissingKeys: globalStats.totalMissingKeys,
                languageNames,
            },
            missingTranslations: {},
        };

        for (const [code, keys] of Object.entries(missingByLang)) {
            out.missingTranslations[code] = {};
            keys.forEach((k) => {
                out.missingTranslations[code][k] = getValue(masterData, k);
            });
        }

        if (saveJson(MISSING_TRANSLATIONS_FILE, out)) {
            console.log(colorize(`\n📝 Missing translations file written: ${path.basename(MISSING_TRANSLATIONS_FILE)}`, "green"));
        }

        printAgentInstructions(missingByLang, languageNames);
    } else {
        console.log(colorize("\n🎉 No missing translations detected.", "green"));
        console.log(colorize("You can report that the task is complete.", "cyan"));
    }

    // Summary
    console.log(colorize("\n📊 SUMMARY", "cyan"));
    console.log(colorize("==========", "cyan"));
    console.log(colorize(`Files processed: ${globalStats.totalFilesProcessed}`, "blue"));
    console.log(colorize(`Files modified (excess cleaned): ${globalStats.filesModified.length}`, "yellow"));
    console.log(colorize(`Excess keys removed: ${globalStats.totalKeysRemoved}`, "red"));
    console.log(colorize(`Missing keys total: ${globalStats.totalMissingKeys}`, "yellow"));

    if (FLAG_DRY_RUN) {
        console.log(colorize("\n(dry-run) No files were written.", "yellow"));
    }

    console.log(colorize("\n✅ Audit complete\n", "green"));
}

function printAgentInstructions(missingByLang, languageNames) {
    const totalMissingKeys = Object.values(missingByLang).reduce((sum, keys) => sum + keys.length, 0);
    const totalLanguages = Object.keys(missingByLang).length;
    const avgKeysPerLang = Math.round(totalMissingKeys / totalLanguages);

    console.log(colorize("\n🤖 AI AGENT INSTRUCTIONS", "cyan"));
    console.log(colorize("========================", "cyan"));
    console.log("Translate missing keys in missing-translations.json:");
    for (const [code, keys] of Object.entries(missingByLang)) {
        console.log(colorize(`  - ${code} (${languageNames[code]}): ${keys.length} missing`, "yellow"));
    }
    console.log("\nGuidelines:");
    console.log("  • Keep keys (paths) unchanged");
    console.log("  • Translate only values");
    console.log("  • Preserve placeholders like {{ value }}");

    // Determine if task is too large
    const TOO_MANY_KEYS_THRESHOLD = 500; // Threshold for "too many" translations

    if (totalMissingKeys > TOO_MANY_KEYS_THRESHOLD) {
        console.log(colorize("\n⚠️  LARGE TRANSLATION TASK DETECTED", "yellow"));
        console.log(colorize("====================================", "yellow"));
        console.log(`Total missing keys: ${totalMissingKeys} (average ${avgKeysPerLang} per language)`);
        console.log("\nRecommended workflow for large tasks:");
        console.log(colorize("  1. Translate ONE language at a time in missing-translations.json", "cyan"));
        console.log(colorize("  2. After translating a language, run:", "cyan"));
        console.log(colorize(`     npm run apply-translations -- --i-am-an-agent --lang <languageCode>`, "green"));
        console.log(colorize("  3. Repeat steps 1-2 for each language", "cyan"));
        console.log(colorize("  4. Continue until missing-translations.json is manageable", "cyan"));
        console.log(colorize("  5. Once manageable, translate remaining languages and run:", "cyan"));
        console.log(colorize("     npm run apply-translations -- --i-am-an-agent", "green"));
        console.log(colorize("\n⚠️  IMPORTANT:", "yellow"));
        console.log("  • Do NOT create new scripts");
        console.log("  • If the task is still too large after this approach, STOP and ask the developer");
        console.log("    what options they have (e.g., translation service API, batch processing, etc.)");
    } else {
        console.log("\nAfter translating all languages, run:");
        console.log(colorize("  npm run apply-translations -- --i-am-an-agent", "green"));
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    getAllKeys,
    getValue,
    loadJson,
    TRANSLATIONS_DIR,
    MASTER_FILE,
};
