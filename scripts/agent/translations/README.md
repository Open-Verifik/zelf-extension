# Translation Management Scripts

This directory contains scripts to help manage translations across multiple languages efficiently and safely.

## New Workflow (Recommended)

### 1. check-translations.js

-   ✅ **Automatic cleanup**: Removes excess keys that don't exist in the master file
-   📊 **Missing key detection**: Identifies keys that need translation (including empty strings)
-   📝 **Creates missing-translations.json**: Centralized file for managing missing translations
-   🤖 **AI-friendly instructions**: Clear, copy-paste instructions for AI agents
-   🔍 **Auto-detection**: Dynamically detects all supported languages from translation files
-   🏷️ **Language metadata**: Includes comprehensive language name mappings

### 2. apply-translations.js

-   🚀 **Batch updates**: Programmatically updates all language files at once
-   ✨ **Validation**: Warns about potentially untranslated content
-   🧹 **Auto cleanup**: Resets missing-translations.json after applying
-   🛡️ **Safe execution**: Requires --i-am-an-agent flag to prevent accidental runs

## Usage

### Agent Required Flag

Both scripts require the `--i-am-an-agent` flag to execute. This prevents accidental runs and ensures intentional usage.

```bash
# Check for missing translations
npm run check-translations -- --i-am-an-agent

# Apply translations
npm run apply-translations -- --i-am-an-agent
```

### Complete Workflow:

```bash
# 1. Check for missing translations
npm run check-translations -- --i-am-an-agent

# 2. Edit scripts/agent/translations/missing-translations.json
#    - Translate all English values to their respective languages
#    - Keep all keys (paths) unchanged
#    - Preserve placeholders like {{ value }}

# 3. Apply the translations
npm run apply-translations -- --i-am-an-agent

# 4. Verify everything is complete
npm run check-translations -- --i-am-an-agent
```

### Optional Flags:

```bash
# Dry run (show what would happen without making changes)
npm run check-translations -- --i-am-an-agent --dry-run

# Verbose output (detailed logging)
npm run check-translations -- --i-am-an-agent --verbose

# Combine flags
npm run apply-translations -- --i-am-an-agent --dry-run --verbose
```

### Benefits of New Workflow:

-   ✅ **No line-by-line editing** of individual language files
-   ✅ **Centralized translation management** via JSON file
-   ✅ **Prevents accidental damage** to language files with agent flag requirement
-   ✅ **Clear AI agent instructions** with no room for interpretation
-   ✅ **Automatic language detection** - no hardcoded language list to maintain
-   ✅ **Dry-run mode** for safe testing before applying changes
-   ✅ **Robust path resolution** - works from any directory in the repo

## How It Works

1. **Auto-detects** the repository root by finding angular.json
2. **Loads** the master file (`src/assets/i18n/en.json`)
3. **Discovers** all language files dynamically (any .json except en.json)
4. **Analyzes** all translation files for missing and excess keys
5. **Removes** excess keys that don't exist in the master file
6. **Detects** missing keys (undefined, null, or empty string values)
7. **Generates** missing-translations.json with comprehensive metadata
8. **Provides** AI-friendly instructions for completing translations

## Supported Languages

Languages are **auto-detected** from files in `src/assets/i18n/`. Currently includes:

-   🇸🇦 **ar.json** - Arabic
-   🇧🇷 **br.json** - Portuguese (Brazil)
-   🇨🇳 **cn.json** - Chinese (Simplified)
-   🇪🇸 **es.json** - Spanish
-   🇫🇷 **fr.json** - French
-   🇮🇳 **in.json** - Hindi (India)
-   �� **ja.json** - Japanese
-   🇰🇷 **kr.json** - Korean
-   🇵🇭 **ph.json** - Filipino (Tagalog)
-   🇷🇺 **ru.json** - Russian
-   🇹🇭 **th.json** - Thai
-   🇵🇰 **ur.json** - Urdu

_New languages are automatically supported by adding a new .json file._

## AI Agent Integration

The enhanced workflow provides ultra-clear instructions for AI agents. Simply tell an AI agent:

> "Please run `npm run check-translations -- --i-am-an-agent` and follow the instructions in the output"

The agent will:

1. Run the check-translations script with the required flag
2. See the step-by-step instructions
3. Edit the missing-translations.json file with proper translations
4. Run apply-translations to update all language files
5. Verify completion with check-translations

**Key advantage**: No manual editing of individual language files, reducing errors and inconsistencies.

## Output Sections

### check-translations.js Output:

1. **Master file stats**: Key count from en.json
2. **Detected languages**: All discovered language codes
3. **Per-language analysis**: Keys, missing, excess, and cleanup actions
4. **Missing translations file**: Generated with metadata and English values
5. **AI agent instructions**: Clear guidelines for translation work
6. **Summary**: Global statistics across all files

### apply-translations.js Output:

1. **Validation warnings**: Flags potentially untranslated content
2. **Per-language updates**: Count of applied translations
3. **Summary**: Total languages and keys updated
4. **Next steps**: Reminder to verify with check-translations

## Missing Translations File Structure

```json
{
  "metadata": {
    "generatedAt": "2025-11-10T12:00:00.000Z",
    "totalLanguages": 3,
    "totalMissingKeys": 45,
    "languageNames": {
      "es": "Spanish",
      "fr": "French",
      "ja": "Japanese"
    }
  },
  "missingTranslations": {
    "es": {
      "some.nested.key": "English value to translate",
      "another.key": "Another English value"
    },
    "fr": {
      "some.nested.key": "English value to translate"
    }
  }
}
```

## Safety

-   ✅ **Non-destructive**: Only removes excess keys, never touches existing translations
-   ✅ **Agent flag required**: Prevents accidental execution
-   ✅ **Dry-run mode**: Test changes before applying them
-   ✅ **Backup friendly**: Easy to rollback changes with git
-   ✅ **Validation**: Proper JSON structure maintained
-   ✅ **Deep object handling**: Correctly handles nested JSON structures
-   ✅ **Empty value detection**: Treats empty strings as missing translations

## Example Output

### check-translations.js

```
🔍 Translation Audit
====================

Master file en.json keys: 488
Detected languages: ar, br, cn, es, fr, in, ja, kr, ph, ru, th, ur

� es.json
  Keys: 485
  Missing: 3
  Excess: 0
  No excess keys

📝 Missing translations file written: missing-translations.json

🤖 AI AGENT INSTRUCTIONS
========================
Translate missing keys in missing-translations.json:
  - es (Spanish): 3 missing
  - fr (French): 5 missing
  - ja (Japanese): 2 missing

Guidelines:
  • Keep keys (paths) unchanged
  • Translate only values
  • Preserve placeholders like {{ value }}

After translating run:
  npm run apply-translations -- --i-am-an-agent

� SUMMARY
==========
Files processed: 12
Files modified (excess cleaned): 0
Excess keys removed: 0
Missing keys total: 10

✅ Audit complete
```

### apply-translations.js

```
🚀 Applying Translations
========================

✅ es: applied 3 translations
✅ fr: applied 5 translations
✅ ja: applied 2 translations

📋 SUMMARY
==========
Languages updated: 3
Total keys applied: 10
✅ Translations applied.
Run: npm run check-translations -- --i-am-an-agent to verify.
```

## Maintenance

Run these scripts regularly to keep translations in sync:

-   After adding new keys to `en.json`
-   Before releasing new versions
-   When onboarding new languages (just add a new .json file)
-   As part of CI/CD pipeline (optional)

### Adding a New Language

1. Create a new file in `src/assets/i18n/` (e.g., `de.json`)
2. Copy the structure from `en.json`
3. Run `npm run check-translations -- --i-am-an-agent`
4. The script will automatically detect the new language
5. Follow the workflow to translate all keys

### Troubleshooting

**Script won't run:**
- Ensure you're using the `--i-am-an-agent` flag

**Translations not applying:**
- Check that the language code in missing-translations.json matches the filename (without .json)
- Verify JSON syntax is valid
- Run with `--verbose` flag for detailed logging

**Dry-run for testing:**
- Use `--dry-run` flag to see what would happen without making changes

## Technical Details

### Key Features:

- **Dynamic repo detection**: Finds angular.json to determine repo root
- **Nested key support**: Handles deeply nested JSON structures (e.g., `auth.login.title`)
- **Path-based operations**: Uses dot notation for key paths
- **Cleanup after deletion**: Removes empty parent objects after key deletion
- **Metadata preservation**: Maintains language name mappings across runs

### Dependencies:

- Node.js (built-in modules only: fs, path)
- No external packages required
