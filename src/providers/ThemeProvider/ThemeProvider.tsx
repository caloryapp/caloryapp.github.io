import { ComponentChildren } from 'preact'
import { ThemeContextProps, ThemeContext } from './ThemeProvider.context'
import { useEffect, useMemo, useState } from 'preact/hooks'

type ThemeProviderProps = {
  children: ComponentChildren
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ||
      document.documentElement.getAttribute('data-theme') ||
      'light'
  )

  const ctxValue = useMemo<ThemeContextProps>(
    () => ({
      theme,
      setTheme
    }),
    [theme]
  )

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <ThemeContext value={ctxValue}>{children}</ThemeContext>
}

export default ThemeProvider
