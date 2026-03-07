import { ComponentChildren } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { useLiveQuery } from 'dexie-react-hooks'
import { SEARCH_URL } from '../../config'
import {
  PREFERENCES_KEY,
  db,
  ensureEntriesSeed,
  articlesTable,
  entriesTable,
  preferencesTable
} from '../../services/db'
import { Article, Entry, Preferences } from '../../services/types'
import { StoreContext, StoreContextProps } from './context'
import { getTotalSum } from './helpers'

type StoreProviderProps = {
  children: ComponentChildren
}

const StoreProvider = ({ children }: StoreProviderProps) => {
  const preferences = useLiveQuery(() =>
    preferencesTable().toCollection().first()
  )
  const entryList = useLiveQuery(() =>
    entriesTable().orderBy('displayOrder').toArray()
  )
  const articleList = useLiveQuery(() => articlesTable().toArray())

  const { totalSum, sums } = useMemo(
    () => getTotalSum(entryList ?? []),
    [entryList]
  )

  const ctxValue = useMemo<StoreContextProps>(
    () => ({
      // user
      preferences: {
        goal: preferences?.goal ?? NaN,
        searchUrl: preferences?.searchUrl ?? SEARCH_URL
      },
      updatePreferences: async (preferences: Partial<Preferences>) => {
        await preferencesTable().upsert(PREFERENCES_KEY, preferences)
      },
      // articles
      articleList,
      searchArticleById: async (articleId: string) => {
        return await articlesTable().where('id').equals(articleId).first()
      },
      searchArticleByName: async (articleName: string) => {
        return await articlesTable()
          .where('name')
          .equalsIgnoreCase(articleName)
          .first()
      },
      replaceArticles: async (articles: Article[]) => {
        await db.transaction('rw', articlesTable(), async () => {
          await articlesTable().clear()
          if (articles.length > 0) {
            await articlesTable().bulkPut(articles)
          }
        })
      },
      putArticle: async (article: Article) => {
        await articlesTable().put(article)
      },
      deleteArticle: async (articleId: string) => {
        await articlesTable().delete(articleId)
      },

      // entries
      totalSum,
      entryList,
      toggleSection: async (entryId: string) => {
        const entries = await entriesTable().orderBy('displayOrder').toArray()
        const sectionIndex = entries.findIndex((entry) => entry.id == entryId)
        const ids: string[] = []
        let collapsed = false
        for (let i = sectionIndex + 1; i < entries.length; i++) {
          const entry = entries[i]
          collapsed ||= entry.hide
          if (entry.type == 'section') break
          ids.push(entry.id)
        }
        await entriesTable()
          .where('id')
          .anyOf(ids)
          .modify((entry) => {
            entry.hide = !collapsed
          })
      },
      isSectionCollapsed: (entryId: string) => {
        if (!entryList) return false
        const sectionIndex = entryList.findIndex((entry) => entry.id == entryId)
        const nextEntry = entryList[sectionIndex + 1]
        return nextEntry && nextEntry.hide
      },
      isSectionEmpty: (entryId: string) => {
        if (!entryList) return true
        const sectionIndex = entryList.findIndex((entry) => entry.id == entryId)
        const nextEntry = entryList[sectionIndex + 1]
        return !nextEntry || nextEntry.type == 'section'
      },
      getTotalSum: (entryId: string) => sums[entryId] ?? NaN,
      clearEntries: async () => {
        await entriesTable().clear()
      },
      putEntry: async (entry: Entry) => {
        await entriesTable().put(entry)
      },
      deleteEntry: async (entryId: string) => {
        await entriesTable().delete(entryId)
      },
      deleteSection: async (entryId: string) => {
        if (!entryList) return
        const ids = [entryId]
        const index = entryList.findIndex((entry) => entry.id == entryId)
        for (let i = index + 1; i < entryList.length; i++) {
          if (!entryList[i].hide) break
          ids.push(entryList[i].id)
        }
        await entriesTable().bulkDelete(ids)
      }
    }),
    [totalSum, sums, preferences, articleList, entryList]
  )

  useEffect(() => {
    if (!entryList || entryList.length > 0) return
    ensureEntriesSeed()
  }, [entryList])

  return <StoreContext value={ctxValue}>{children}</StoreContext>
}

export default StoreProvider
