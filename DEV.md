# CaloryApp - AI Agent Guide

## Project Overview

CaloryApp is a calorie counting web application built as a Chrome browser extension. It allows users to track their daily food intake by adding food entries with calorie information. The app supports organizing entries into sections (like Breakfast, Lunch, Dinner), persisting data locally using IndexedDB, and managing a reusable article database for quick entry.

**Key Features:**

- Add food entries with calories per 100g or per unit
- Organize entries into collapsible sections
- Drag-and-drop reordering of entries
- Auto-save with debouncing
- Article database for quick food lookup
- Import/export articles as JSON
- Theme switching (light, caramellatte, valentine)
- Internationalization (English/Spanish)

## Technology Stack

| Category      | Technology                                               |
| ------------- | -------------------------------------------------------- |
| Framework     | [Preact](https://preactjs.com/) 10.x (React alternative) |
| Language      | TypeScript 5.x                                           |
| Build Tool    | Vite 7.x                                                 |
| Styling       | Tailwind CSS 4.x + [DaisyUI](https://daisyui.com/) 5.x   |
| Database      | [Dexie.js](https://dexie.org/) (IndexedDB wrapper)       |
| Drag & Drop   | [SortableJS](https://sortablejs.github.io/)              |
| i18n          | i18next + react-i18next                                  |
| Testing       | Vitest + @testing-library/preact                         |
| Component Dev | [Ladle](https://ladle.dev/) (Storybook alternative)      |
| Linting       | ESLint 9.x with TypeScript support                       |
| Formatting    | Prettier                                                 |
| Git Hooks     | Husky                                                    |

## Build and Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter (ESLint + TypeScript check)
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Run tests
npm run test

# Start Ladle component development server
npm run ladle
```

## Project Structure

```
calory/
├── public/                    # Static assets
├── src/                       # Sources
│   ├── main.tsx               # Main app entry point
│   ├── config/                # App configuration
│   ├── libs/                  # Utility functions
│   ├── assets/                # Static assets (SVG icons)
│   ├── components/            # React/Preact components
│   │   ├── feedback/          # Feedback components
│   │   ├── inputs/            # Form input components
│   │   └── navigation/        # Navigation components
│   ├── dialogs/               # App dialog modules
│   ├── pages/                 # App pages
│   ├── providers/             # Context providers
│   ├── services/              # Data layer
│   ├── types/                 # Type declarations and shims
│   ├── locales/               # i18n translations
│   └── test/                  # Test setup
├── scripts/                   # Project scripts
├── reports/                   # Generated reports
└── .husky/pre-push            # Git pre-push hook
```

## Code Style Guidelines

### TypeScript/JavaScript

- **No semicolons**: Project uses `semi: false` in Prettier/ESLint
- **Single quotes**: Use single quotes for strings
- **No trailing commas**: Keep arrays/objects compact
- **Arrow functions with spacing**: `(arg) => { }`
- **Object curly spacing**: `{ key: value }`
- **Array bracket spacing**: `[1, 2, 3]` (no extra spaces)

### Import Conventions

```ts
// External libraries first
import { useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'

// Internal imports with `src/` alias
import { cn } from 'src/libs/tw'
import { capitalize } from 'src/libs/strings'
import { Entry } from 'src/services/types'
import { useStoreContext } from 'src/providers/StoreProvider'
```

### React/Preact Specifics

- Use `class` instead of `className` for CSS classes (configured in ESLint)
- Components are self-closing when possible: `<Component />`
- Use Preact hooks from `preact/hooks`
- React compatibility via `preact/compat` aliasing

### File Naming

- Components: PascalCase (e.g., `Calculator.tsx`)
- Utilities: camelCase (e.g., `helpers.ts`)
- Styles: ComponentName.module.css for CSS modules
- Tests: ComponentName.test.tsx alongside the component
- Stories: ComponentName.stories.tsx alongside the component

### CSS/Styling

- Use Tailwind CSS utility classes for most styling
- CSS Modules (`.module.css`) for component-specific styles
- DaisyUI component classes (e.g., `btn`, `input`, `modal`)
- Custom CSS variables for theme colors

## Database Schema

The app uses Dexie.js with IndexedDB, version 1:

```ts
// db version + indexes
db.version(1).stores({
  entries: '&id,createdAt,displayOrder',
  articles: '&id,createdAt,name'
})

// entries table
{
  id: string // Primary key
  createdAt: number // Timestamp
  displayOrder: string // Fractional indexing for sorting
  type: 'section' | 'kcalPer100g' | 'kcalPerUnit'
  name: string
  kcal: number
  total: number
  discard: boolean // Exclude from calorie calculation
  hide: boolean // Hidden (collapsed section)
}

// articles table
{
  id: string // Primary key
  createdAt: number // Timestamp
  type: 'kcalPer100g' | 'kcalPerUnit'
  name: string
  kcal: number
  total: number
}
```

## Testing

### Test Setup

- **Framework**: Vitest with jsdom environment
- **Testing Library**: @testing-library/preact
- **Mocking**: fake-indexeddb for IndexedDB mocking
- **Assertions**: @testing-library/jest-dom matchers

### Running Tests

```bash
# Run all tests
npm run test

# Run in watch mode (during development)
npx vitest
```

### Test Conventions

- Tests are co-located with components (`ComponentName.test.tsx`)
- Use `render()` from `@testing-library/preact`
- Mock external dependencies in `src/test/setup.ts`
- Database operations in tests use fake-indexeddb

### Example Test Pattern

```tsx
import { render, screen, fireEvent } from '@testing-library/preact'
import { describe, it, expect, beforeEach } from 'vitest'

// Wrap component with required providers
const renderCalculator = () => {
  render(
    <DialogsProvider>
      <StoreProvider>
        <Calculator />
      </StoreProvider>
    </DialogsProvider>
  )
}
```

## Development Workflow

### Git Hooks

**Pre-push hook** (`.husky/pre-push`) runs:

1. `npm run lint` - ESLint + TypeScript check
2. `npm run test` - Run all tests

Both must pass before pushing to remote.

### Adding a New Component

1. Create folder in `src/components/ComponentName/`
2. Add main component file: `ComponentName.tsx`
3. Add index file: `index.ts` with exports
4. Add styles: `ComponentName.module.css` (if needed)
5. Add stories: `ComponentName.stories.tsx` (for Ladle)
6. Add tests: `ComponentName.test.tsx`

### Adding Translations

1. Add key to both `src/locales/en.json` and `src/locales/es.json`
2. Use template literal syntax in components: `` t`translation-key` ``
3. Keep keys descriptive and hyphen-separated

## Chrome Extension Details

- **Manifest Version**: 3
- **Permissions**: `storage`, `tabs`
- **Entry Points**:
  - Popup: `popup.html` (small popup UI)
  - Main App: `index.html` (full tab interface)
- Build outputs to `dist/` with `index.html` and `popup.html`

## Common Issues & Solutions

### TypeScript Path Aliases

The project uses `src/*` path aliasing. Ensure imports use this pattern:

```tsx
import { something } from 'src/components/Component'
// NOT: import { something } from '../components/Component'
```

### Preact/React Compatibility

React libraries work via aliases in `tsconfig.json`:

```json
{
  "paths": {
    "react": ["./node_modules/preact/compat/"],
    "react-dom": ["./node_modules/preact/compat/"]
  }
}
```

### Database Migrations

When changing the database schema:

1. Update `src/services/db.ts`
2. Increment `db.version(N)`
3. Define stores with indexes: `'&id,createdAt,displayOrder'`

## Security Considerations

- All data is stored locally in browser's IndexedDB
- No external API calls except FatSecret search URL (user-initiated)
- Chrome extension permissions are minimal (storage, tabs only)
- File import/export operates on user-selected files only
