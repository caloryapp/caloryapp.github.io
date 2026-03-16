# CaloryApp - Developer Guide

## Overview

CaloryApp is a calorie counter built with Preact and Vite. The repository currently builds two entry points:

- `index.html`: main app
- `popup.html`: browser-extension popup

The app stores data locally in IndexedDB via Dexie and supports reusable articles, sections, drag-and-drop ordering, import/export, theming, and English/Spanish translations.

## Stack

| Category | Technology |
| --- | --- |
| UI | Preact 10 |
| Language | TypeScript 5 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 + DaisyUI 5 + CSS Modules |
| Data | Dexie 4 + IndexedDB |
| Drag & Drop | SortableJS |
| i18n | i18next + react-i18next |
| Testing | Vitest + Testing Library for Preact |
| Component Dev | Ladle |
| Linting | ESLint 9 + typescript-eslint |
| Formatting | Prettier |
| Git Hooks | Husky |

## Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Watch production build
npm run build:watch

# Preview build output
npm run preview

# Bundle analysis
npm run stats
npm run stats:text

# Lint + TypeScript check
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format source files
npm run format

# Run tests once
npm run test

# Ladle component playground
npm run ladle
```

Notes:

- `npm run lint` runs `eslint src` and `tsc --noEmit -p tsconfig.dev.json`.
- `npm run format` currently formats `src/` only.
- `npm run test` runs `vitest run` rather than watch mode.

## Project Structure

```text
caloryapp.github.io/
├── public/                 # Static assets and extension manifest
├── docs/                   # User-facing documentation and media
├── reports/                # Generated bundle analysis output
├── src/
│   ├── assets/             # SVG icons and static UI assets
│   ├── components/         # Reusable UI components
│   ├── config/             # Theme and general config
│   ├── dialogs/            # Dialog modules
│   ├── libs/               # Shared helpers
│   ├── locales/            # i18n resources
│   ├── pages/              # Route/page-level UI
│   ├── providers/          # App state/providers
│   ├── services/           # IndexedDB layer and types
│   ├── test/               # Test setup
│   ├── App.tsx             # Main app shell
│   ├── PopupApp.tsx        # Popup shell
│   ├── bootstrap.ts        # Early theme/lang bootstrap
│   ├── i18n.ts             # i18n initialization
│   ├── main.tsx            # Main app entry
│   └── popup.tsx           # Popup entry
├── index.html              # Main app entry HTML
├── popup.html              # Popup entry HTML
├── popup.ts                # Extension popup bootstrap
├── vite.config.ts
└── vitest.config.ts
```

## Conventions

### TypeScript and imports

- The project uses strict TypeScript settings.
- Use absolute imports via `src/...` for anything outside the current directory.
- Relative parent imports like `../...` are blocked by ESLint.
- JSON imports are enabled for locale files.

Example:

```ts
import { useTranslation } from 'react-i18next'
import { cn } from 'src/libs/tw'
import { entriesTable } from 'src/services/db'
```

### Preact specifics

- JSX is configured with `jsxImportSource: 'preact'`.
- Hooks come from `preact/hooks`.
- The codebase allows `class` in JSX.
- React compatibility is provided where needed through `preact/compat`.

### Formatting and linting

- No semicolons
- Single quotes
- No trailing commas
- Use object spacing: `{ key: value }`
- Use array style: `[1, 2, 3]`

These rules are enforced primarily through ESLint, with Prettier used for formatting.

### Naming

- Components: `PascalCase.tsx`
- Hooks/helpers: `camelCase.ts`
- CSS modules: `ComponentName.module.css`
- Tests: `*.test.tsx`
- Stories: `*.stories.tsx`

## Styling

- Tailwind CSS 4 is loaded from `src/styles.css`.
- DaisyUI is configured there as a Tailwind plugin.
- Available themes are currently:
  - `light`
  - `caramellatte`
  - `valentine`
- CSS Modules are used where utility classes are not enough.

## Data Model

Dexie currently defines version 1 with two tables:

```ts
db.version(1).stores({
  entries: '&id,createdAt,displayOrder',
  articles: '&id,createdAt,name'
})
```

`Entry`:

```ts
{
  id: string
  createdAt: number
  displayOrder: string
  type: 'section' | 'kcalPer100g' | 'kcalPerUnit'
  name: string
  kcal: number
  total: number
  discard: boolean
  hide: boolean
}
```

`Article`:

```ts
{
  id: string
  createdAt: number
  type: 'kcalPer100g' | 'kcalPerUnit'
  name: string
  kcal: number
  total: number
}
```

When the entries table is empty, the app seeds an initial empty section automatically.

## Testing

- Test environment: `jsdom`
- Setup file: `src/test/setup.ts`
- IndexedDB is mocked with `fake-indexeddb`
- `IntersectionObserver` and some dialog APIs are mocked in test setup
- `react-i18next` is mocked for most component tests

The repository currently contains:

- a smoke test in `src/test/smoke.test.tsx`
- page-level tests such as `src/pages/HomePage/HomePage.test.tsx`

## Workflow Notes

### Git hook

`.husky/pre-push` runs:

1. `npm run lint`
2. `npm run test`

### Translations

- Add keys to both `src/locales/en.json` and `src/locales/es.json`.
- The codebase uses both `t('namespace:key')` and tagged-template usage like `` t`common:theme` ``.
- `i18next-browser-languagedetector` is enabled and caches language in `localStorage`.

### Bundle analysis

- `npm run stats` writes an HTML report to `reports/stats.html`.
- `npm run stats:text` writes a Markdown report to `reports/stats.md`.
