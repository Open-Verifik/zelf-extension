# Zelf Wallet — Web Extension

A secure, privacy-focused Chrome extension for managing crypto wallets and digital identity through **ZelfProofs** — privacy-preserving digital signatures that enable proof of personhood, passwordless authentication, and encrypted key management without storing biometric data.

- [name.zelf.world](https://name.zelf.world) — Zelf Name Service
- [docs.zelf.world](https://docs.zelf.world) — Documentation

## Features

- **ZelfProofs** — face-derived, non-biometric cryptographic proofs for identity verification, encryption, and passwordless login (online and offline via QR codes)
- **Multi-chain wallets** — Ethereum / EVM, Solana, Bitcoin, Stellar, and Sui
- **WalletConnect v2** — connect to dApps through the WalletConnect protocol
- **Web3 provider injection** — in-page provider bridge for dApp compatibility
- **Autofill** — credential autofill via content scripts
- **Internationalization** — multi-language support powered by Transloco
- **Side panel** — runs as a Chrome side panel or popup

## Tech Stack

- Angular 19 with a custom Architect builder for Chrome extension packaging
- Webpack pipeline for background scripts, content scripts, and in-page provider
- Chrome Manifest V3

## Requirements

- **Node.js** — version compatible with Angular 19 (20.x or 22.x LTS recommended)
- **npm**

## Install

```bash
npm install
```

## Development

The primary development workflow uses the custom extension builder in watch mode, which compiles both Angular and webpack extension scripts and outputs to `dist/dev`:

```bash
npm run watch
```

After a successful build, load the extension in Chrome:

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist/dev` directory

The watcher recompiles on file changes — reload the extension in Chrome to pick up updates.

### Dev server (optional)

`npm start` runs the standard Angular dev server (`ng serve`) at `http://localhost:4200/`. This is useful for iterating on UI outside the extension context but does not produce extension-loadable output.

## Build

| Command | What it does |
|---|---|
| `npm run build:dev` | Dev build via the custom builder (`ng run zelf-extension:builder:dev_chrome`) — output in `dist/dev` |
| `npm run build:prod` | Production build + unit tests + Transloco optimization — output in `dist/prod` |
| `npm run build` | Bumps patch version, then runs `build:prod` |

Version bumps (`bump:major`, `bump:minor`, `bump:patch`) update both `package.json` and the extension manifest via `scripts/sync-versions.js`.

## Testing

```bash
npm test                # Headless Chrome, single run
npm run test:ci         # CI-optimized (ChromeHeadlessCI)
npm run test:coverage   # With code coverage report
```

End-to-end tests use Puppeteer:

```bash
npm run e2e             # Interactive
npm run e2e:headless    # Headless
```

## Internationalization

Translation files live in `src/assets/i18n/`. Useful scripts for contributors working with translations:

| Command | Purpose |
|---|---|
| `npm run i18n:find` | Find translation keys in source (Transloco keys manager) |
| `npm run i18n:sync` | Sync translation files across locales |
| `npm run check-translations` | Check for missing or unused keys |
| `npm run apply-translations` | Apply pending translation updates |

## License

Proprietary. See repository for terms.
