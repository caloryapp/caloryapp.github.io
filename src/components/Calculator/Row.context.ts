import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { DebouncedState } from 'use-debounce'
import { Entry } from 'src/services/types'

export type RowContextProps = {
  autoFocus: boolean
  entry: Entry
  onEntryChange: (entry: Entry) => void
  save: () => void
  debouncedSave: DebouncedState<() => void>
}

export const RowContext = createContext<RowContextProps | null>(null)

export const useRowContext = () => {
  const ctx = useContext(RowContext)
  if (!ctx) {
    throw new Error('useRowContext must be used within <RowContext />')
  }
  return ctx
}
