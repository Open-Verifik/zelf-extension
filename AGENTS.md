# AGENTS.md

## Product scope

The extension does **not** ship **Zelf Chat** (no chat routes, components, or services). Community links in **Rewards** are external (e.g. Discord/Telegram tasks only). Token **About** URLs in code follow the price/metadata API shape (website, explorer, socials); we do not model or surface a separate in-app chat product.

## Verifying extension changes (Cursor / agents)

- **Always use `npm run watch`** when checking that the extension compiles after edits. It runs the dev Chrome extension builder in **watch** mode (`ng run zelf-extension:builder:dev_chrome --watch`) and is the default verification workflow.
- **Do not** run `ng build`, one-off `ng run ...` builder commands, or other compile-only invocations for routine checks after changes. Full one-off builds are heavier and less convenient than watch.
- Project rule: `.cursor/rules/extension-build-workflow.mdc`.
