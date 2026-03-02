## Introduction

This project is a Chrome extension for calculating calories. The user manually enters different ingredients, and the calculator adds up the calories. This allows the user to plan their daily menu.

## Considerations

Although communication can be done in Spanish, the project has an international scope and therefore must be written entirely in English.

## Architecture

The project was developed using Vite, Preact, and TypeScript.

### Relevant Libraries

These are some of the most relevant libraries:

- [DaisyUI](https://daisyui.com): for UI development
- [dexie](https://github.com/dexie/Dexie.js): for accessing IndexedDB

Other libraries can be found in `package.json`.

### Imports

We will use `src/...` to import from outside the current folder and `./...` for local imports. For example:

```tsx
import MyComponent from 'src/components/MyComponent'
import { myFunction } from './helpers'
```
