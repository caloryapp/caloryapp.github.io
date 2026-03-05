# Development Notes

## Publish Beta To npm

Run these commands from the project root (`calory/`):

```bash
# 1) Check current version
npm pkg get version

# 2) Bump prerelease beta version
npm version prerelease --preid=beta

# 3) Publish using beta dist-tag
npm publish --tag beta --access public
```

Optional verification:

```bash
# Check dist-tags (latest, beta, etc.)
npm view @caloryapp/calculator dist-tags

# Check published versions
npm view @caloryapp/calculator versions --json
```

## SVG Icons (`?react`)

This project imports SVG icons as React components via `vite-plugin-svgr` (for example, `import CalculatorIcon from '.../calculator.svg?react'`).

Important behavior:

- Use `className` when passing classes to icon components.
- Do not use `class` on `?react` icon components.

Why:

- SVGR converts the SVG `class` attribute into `className` in JSX.
- If you want to override the default icon size class (for example, `size-7`), pass it through `className`.

Example:

```tsx
<CalculatorIcon className="size-4" />
```
