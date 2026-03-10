import { createContext } from 'preact'
import { MutableRef, useContext } from 'preact/hooks'
import { Article, Entry, EntryType } from '../../services/types'

export type CalculatorContextProps = {
  focusIdRef: MutableRef<string>
  articles: Article[]
  visibleEntryList: Entry[]
  showEditGoalDialog: () => void
  importArticles: () => void
  exportArticles: () => void
  clearEntries: () => void
  addEntry: (afterEntryId: string, type: EntryType) => void
  deleteEntry: (entryId: string) => void
  moveEntry: (params: { fromIndex?: number; toIndex?: number }) => void
}

export const CalculatorContext = createContext<CalculatorContextProps | null>(
  null
)

export const useCalculatorContext = () => {
  const ctx = useContext(CalculatorContext)
  if (!ctx) {
    throw new Error(
      'useCalculatorContext must be used within <CalculatorContext />'
    )
  }
  return ctx
}
