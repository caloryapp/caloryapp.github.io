import { createContext } from 'preact'
import { Dispatch, StateUpdater, useContext } from 'preact/hooks'

export type ThemeContextProps = {
  theme: string
  setTheme: Dispatch<StateUpdater<string>>
}

export const ThemeContext = createContext<ThemeContextProps | null>(null)

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('uninitialized context')
  }
  return ctx
}
