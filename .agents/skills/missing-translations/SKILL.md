---
name: missing-translations
description: Detect hardcoded English strings in src/pages/ .ts and .tsx files that should be internationalized using i18next. Use when the user asks to find missing translations, check for hardcoded text, or detect strings that need i18n in the CaloryApp's pages directory.
---

# Missing Translations Detector

This skill detects hardcoded English strings in `src/pages/` that should be internationalized using the project's i18next setup (`` t`translation-key` `` syntax).

## When to Use

Use this skill when:

- The user asks to find missing translations
- The user wants to detect hardcoded English text
- The user wants to check which strings need i18n in page components
- The user mentions translation issues in pages

## How to Run

Execute the detection script from the project root:

```bash
python3 .agents/skills/missing-translations/scripts/detect_missing_translations.py
```

## What It Detects

The script scans `.ts` and `.tsx` files in `src/pages/` for:

1. **JSX text content**: Text between tags like `<span>CaloryApp</span>`
2. **Attribute text**: Values in `label=`, `title=`, `placeholder=`, `alt=`, `aria-label=` attributes

## What It Ignores

The script automatically skips:

- Files that don't match `.ts` or `.tsx` extensions
- Code outside `src/pages/`
- Import/export statements and type definitions
- Already translated strings using `` t`...` `` syntax
- CamelCase/PascalCase identifiers (likely code)
- File paths, URLs, colors, numbers
- Short strings (< 2 characters)

## Output Format

The script prints a report showing:

- File path with issues
- Line number and type (JSX text or attribute)
- The hardcoded English string found
- Suggested translation key (kebab-case)
- Warning if the suggested key already exists in locale files

## After Detection

For each detected issue:

1. Add the translation to `src/locales/en.json`:

   ```json
   {
     "suggested-key": "Original English Text"
   }
   ```

2. Add to `src/locales/es.json`:

   ```json
   {
     "suggested-key": "Texto en español"
   }
   ```

3. Replace the hardcoded text in the component:

   ```tsx
   // Before
   <span>CaloryApp</span>

   // After
   <span>{t`app-title`}</span>
   ```

4. Ensure `useTranslation` is imported:

   ```tsx
   import { useTranslation } from 'react-i18next'

   const Component = () => {
     const { t } = useTranslation()
     // ...
   }
   ```

## Project i18n Setup

- Translation files: `src/locales/en.json`, `src/locales/es.json`
- Hook: `useTranslation` from `react-i18next`
- Syntax: Template literal `` t`key` `` wrapped in braces: ``{t`key`}``
- Fallback language: Spanish (`es`)
