import { BREAKPOINTS } from './src/config/theme'

export default {
  content: ['./src/**/*.tsx', './.ladle/**/*.tsx'],
  theme: {
    colors: {
      white: '#FFFFFF',
      'kcal-per-100g': 'var(--color-accent)',
      'kcal-per-unit': 'var(--color-warning)'
    },
    screens: {
      sm: `${BREAKPOINTS.sm}px`,
      md: `${BREAKPOINTS.md}px`,
      lg: `${BREAKPOINTS.lg}px`,
      xl: `${BREAKPOINTS.xl}px`
    }
  },
  plugins: []
}
