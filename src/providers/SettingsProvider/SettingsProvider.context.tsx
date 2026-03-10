import { createContext } from 'preact'
import { Dispatch, StateUpdater, useContext } from 'preact/hooks'

export type SettingsContextProps = {
  goal: number
  setGoal: Dispatch<StateUpdater<number>>
}

export const SettingsContext = createContext<SettingsContextProps | null>(null)

export const useSettingsContext = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('uninitialized context')
  }
  return ctx
}
