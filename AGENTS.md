# AGENTS.md

## Verifying extension changes (Cursor / agents)

- **Prefer `npm run watch`** when checking that the extension compiles after edits. It runs the dev Chrome extension builder in **watch** mode (`ng run zelf-extension:builder:dev_chrome --watch`) and is the usual local workflow.
- **Do not default to `ng build`** for quick compile checks; full one-off builds are heavier and less convenient than watch for iterative testing.
