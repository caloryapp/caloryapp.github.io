import { useEffect, useMemo, useState } from 'preact/hooks'

export const useTheme = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ||
      document.documentElement.getAttribute('data-theme') ||
      'light'
  )

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return useMemo(() => ({ theme, setTheme }), [theme])
}
