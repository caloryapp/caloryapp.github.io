import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { Article, Entry } from '../../services/types'

export type StoreContextProps = {
  // articles
  articleList: Article[] | undefined
  searchArticleById: (articleId: string) => Promise<Article | undefined>
  searchArticleByName: (articleName: string) => Promise<Article | undefined>
  replaceArticles: (articles: Article[]) => Promise<void>
  putArticle: (article: Article) => Promise<void>
  deleteArticle: (articleId: string) => Promise<void>

  // entries
  entryList: Entry[] | undefined
  totalSum: number // total kcal sum
  toggleSection: (entryId: string) => Promise<void>
  isSectionCollapsed: (entryId: string) => boolean
  isSectionEmpty: (entryId: string) => boolean
  getTotalSum: (entryId: string) => number // total kcal sum per entry (can be a section)
  clearEntries: () => Promise<void>
  putEntry: (entry: Entry) => Promise<void>
  deleteSection: (entryId: string) => Promise<void>
  deleteEntry: (entryId: string) => Promise<void>
}

export const StoreContext = createContext<StoreContextProps | null>(null)

export const useStoreContext = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error('uninitialized context')
  }
  return ctx
}
