const fs = require("fs");
const path = require("path");

// Adjust the path to point to the i18n directory from scripts folder
const i18nDir = path.join(__dirname, "..", "src", "assets", "i18n");

// Read the English file as reference
const enPath = path.join(i18nDir, "en.json");
const enContent = JSON.parse(fs.readFileSync(enPath, "utf8"));

// Get all language files
const langFiles = fs.readdirSync(i18nDir).filter((file) => file.endsWith(".json") && file !== "en.json");

/**
 * Create a flattened version of an object where keys are dot-notation paths
 * @param {Object} obj - The object to flatten
 * @param {String} prefix - The prefix for keys
 * @returns {Object} - Flattened object
 */
function flattenObject(obj, prefix = "") {
    const result = {};

    for (const key in obj) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(result, flattenObject(obj[key], newKey));
        } else {
            result[newKey] = obj[key];
        }
    }

    return result;
}

/**
 * Unflatten an object with dot-notation paths back to a nested object
 * @param {Object} obj - The flattened object
 * @returns {Object} - Nested object
 */
function unflattenObject(obj) {
    const result = {};

    for (const key in obj) {
        const parts = key.split(".");
        let current = result;

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            current[part] = current[part] || {};
            current = current[part];
        }

        current[parts[parts.length - 1]] = obj[key];
    }

    return result;
}

/**
 * Find duplicate keys in a flat object (keys with same ending)
 * @param {Object} flatObj - The flattened object
 * @returns {Object} - Map of duplicate keys
 */
function findDuplicateKeys(flatObj) {
    const keysMap = {};
    const duplicates = {};

    for (const key in flatObj) {
        const parts = key.split(".");
        const lastPart = parts[parts.length - 1];

        if (!keysMap[lastPart]) {
            keysMap[lastPart] = [];
        }

        keysMap[lastPart].push(key);

        if (keysMap[lastPart].length === 2) {
            duplicates[lastPart] = keysMap[lastPart];
        }
    }

    // Only return entries with duplicates
    return Object.fromEntries(Object.entries(keysMap).filter(([_, paths]) => paths.length > 1));
}

// Check for duplicate keys in the English file
const flatEn = flattenObject(enContent);
const duplicateEnKeys = findDuplicateKeys(flatEn);

if (Object.keys(duplicateEnKeys).length > 0) {
    console.log("⚠️ Found duplicate keys in the English file:");
    for (const [key, paths] of Object.entries(duplicateEnKeys)) {
        console.log(`  - "${key}" appears at: ${paths.join(", ")}`);
    }
    console.log();
}

// Process each language file
langFiles.forEach((langFile) => {
    const langPath = path.join(i18nDir, langFile);
    let langContent;

    try {
        langContent = JSON.parse(fs.readFileSync(langPath, "utf8"));
        console.log(`Processing ${langFile}...`);
    } catch (error) {
        console.error(`Error reading ${langFile}: ${error.message}`);
        return;
    }

    // Flatten the language file
    const flatLang = flattenObject(langContent);

    // Create a new object with the structure of English but values from language file where available
    const merged = {};

    for (const key in flatEn) {
        merged[key] = flatLang[key] !== undefined ? flatLang[key] : flatEn[key];
    }

    // Special handling for duplicate keys:
    // If we find a translated value for any of the duplicates, use it for all occurrences
    for (const [duplicateKey, paths] of Object.entries(duplicateEnKeys)) {
        // Find any translations for this key
        const translatedPaths = paths.filter((path) => flatLang[path] !== undefined && flatLang[path] !== flatEn[path]);

        if (translatedPaths.length > 0) {
            // Use the first translation found for all occurrences
            const translation = flatLang[translatedPaths[0]];

            // Apply this translation to all duplicate occurrences
            for (const path of paths) {
                merged[path] = translation;
            }

            console.log(`  - Applied translation for duplicate key "${duplicateKey}" in ${langFile}`);
        }
    }

    // Unflatten the merged object
    const syncedContent = unflattenObject(merged);

    // Log statistics about changes
    console.log(`  - English keys: ${Object.keys(flatEn).length}`);
    console.log(`  - Original ${langFile} keys: ${Object.keys(flatLang).length}`);
    console.log(`  - Final key count: ${Object.keys(merged).length}`);

    // Write the synchronized content back to file
    try {
        fs.writeFileSync(langPath, JSON.stringify(syncedContent, null, 4), "utf8");
        console.log(`✅ Successfully synchronized ${langFile}`);
    } catch (error) {
        console.error(`Error writing ${langFile}: ${error.message}`);
    }
});

console.log("All language files have been synchronized with en.json");
