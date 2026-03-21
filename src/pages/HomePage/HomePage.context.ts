import { createContext } from 'preact'
import { Dispatch, MutableRef, StateUpdater, useContext } from 'preact/hooks'
import { Article, Entry, EntryType } from 'src/services/types'

export type HomePageContextProps = {
  helpMode: boolean
  setHelpMode: Dispatch<StateUpdater<boolean>>
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

export const HomePageContext = createContext<HomePageContextProps | null>(null)

export const useHomePageContext = () => {
  const ctx = useContext(HomePageContext)
  if (!ctx) {
    throw new Error(
      'useHomePageContext must be used within <HomePageContext />'
    )
  }
  return ctx
}
