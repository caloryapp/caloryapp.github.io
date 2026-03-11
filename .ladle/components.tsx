import '../src/styles.css'
import '../src/i18n'
import { useEffect, useMemo } from 'preact/hooks'
import type { GlobalProvider } from '@ladle/react'
import {
  ThemeContext,
  ThemeContextProps
} from '../src/providers/ThemeProvider/ThemeProvider.context'

export const args = {
  theme: 'light'
}

export const argTypes = {
  theme: {
    options: ['light', 'cupcake', 'caramellatte', 'valentine'],
    control: { type: 'select' }
  }
}

export const Provider: GlobalProvider = ({ children, globalState }) => {
  const selectedTheme = String(globalState.control?.theme?.value ?? 'light')
  const ctxValue = useMemo<ThemeContextProps>(
    () => ({
      theme: selectedTheme,
      setTheme: () => console.error('not implemented')
    }),
    [selectedTheme]
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme)
  }, [selectedTheme])

  // @ts-expect-error false positive from React/Preact type mismatch
  return <ThemeContext value={ctxValue}>{children}</ThemeContext>
}
