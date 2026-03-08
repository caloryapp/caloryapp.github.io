import { createContext } from 'preact'
import { Dispatch, StateUpdater, useContext } from 'preact/hooks'

export type MenuContextProps = {
  open: boolean
  setOpen: Dispatch<StateUpdater<boolean>>
  execCommand: <T>(fn?: (e: T) => void) => (e: T) => void
}

export const MenuContext = createContext<MenuContextProps | null>(null)

export const useMenuContext = () => {
  const ctx = useContext(MenuContext)
  if (!ctx) {
    throw new Error('useMenuContext must be used within <MenuContext />')
  }
  return ctx
}
