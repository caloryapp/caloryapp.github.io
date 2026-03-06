import { createContext } from 'preact'
import { Dispatch, StateUpdater, useContext } from 'preact/hooks'

export type Data = {
  goal: string
  searchUrl: string
}

export type SettingsDialogContextProps = {
  open: boolean
  onClose: () => void
  save: () => void
  changed: boolean
  setChanged: Dispatch<StateUpdater<boolean>>
  data: Data
  setData: Dispatch<StateUpdater<Data>>
}

export const SettingsDialogContext =
  createContext<SettingsDialogContextProps | null>(null)

export const useSettingsDialogContext = () => {
  const ctx = useContext(SettingsDialogContext)
  if (!ctx) {
    throw new Error(
      'useSettingsDialogContext must be used within <SettingsDialogContext />'
    )
  }
  return ctx
}
