# Extension Scripts Environment Configuration

This directory contains environment configuration files for the extension scripts (background and content scripts).

## Files

- `environment.prod.ts` - Production environment (committed to git)
- `environment.ts` - Default environment file (imports from prod by default)
- `environment.dev.ts` - Development environment (gitignored, create locally for development)

## Usage

Import the environment in your extension scripts:

```typescript
import { environment } from "../../extension-scripts/environments/environment";

// Use environment variables
const apiUrl = environment.apiBaseUrl;
```

## Development Setup

1. Create `environment.dev.ts` locally (it's gitignored)
2. Update the values in `environment.dev.ts` for your local development
3. Example content:
    ```typescript
    export const environment = {
        production: false,
        apiBaseUrl: "http://localhost:3050", // or your local dev API URL
    };
    ```

## Build Process

The environment system defaults to **production** and only uses development in special cases:

- **Production builds** (`npm run build:prod`): Uses `environment.prod.ts` (default, no replacement needed)
- **Development builds** (`npm run build:dev`): Webpack replaces `environment.ts` with `environment.dev.ts`
- **Watch mode** (`npm run watch`): Webpack replaces `environment.ts` with `environment.dev.ts`

This is handled by the `NormalModuleReplacementPlugin` in `webpack.extension.config.js`, which only activates in development mode.
