import preact from "eslint-config-preact";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist", "node_modules", "*.config.js"]
  },
  ...preact,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/*'],
              message: 'Use relative paths'
            }
          ]
        }
      ],
      "semi": ["error", "never"],
      "quotes": ["error", "single"],

      // Prevent common bugs
      "no-unused-vars": "off", // Disabled in favor of TypeScript version
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" 
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
      
      // Improve readability
      "comma-dangle": ["error", "never"],
      "arrow-spacing": ["error", { "before": true, "after": true }],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      
      // React/Preact specific
      "react/prop-types": "off",
      "react/no-unknown-property": ["error", { "ignore": ["class"] }],
      "react/self-closing-comp": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off"
    }
  }
];
