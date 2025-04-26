# Zelf Extension Scripts

## Translation Synchronization Script

The `sync-translations.js` script ensures all language files match the structure of the English (`en.json`) file. It performs the following operations:

1. Uses the English file as the reference structure
2. For each other language file:
   - Adds missing keys from English (with English values)
   - Removes keys that don't exist in English
   - Preserves existing translations
   - Handles duplicate keys by applying translations across all instances

### Usage

Run the script using the npm command:

```bash
npm run i18n:sync
```

### What the Script Does

1. Identifies and reports duplicate keys in the English file
2. Flattens both the English and language files to handle nested structures
3. Creates a new object with the structure of the English file but preserves translations from the language file
4. Applies translations consistently across all instances of duplicate keys
5. Unflattens the merged object and writes it back to the language file

### Output

The script provides detailed output about:
- Duplicate keys found in the English file
- Which translations were applied to duplicate keys
- Statistics about the number of keys in each file
- Confirmation when each file is successfully synchronized 