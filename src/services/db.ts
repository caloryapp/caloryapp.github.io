import Dexie from 'dexie'
import { nanoid } from 'nanoid'
import { generateKeyBetween } from 'fractional-indexing'
import { Article, Entry, Preferences } from './types'

type PreferencesTable = Preferences & {
  id: string
}

export const db = new Dexie('calory')
export const preferencesTable = () => db.table<PreferencesTable>('preferences')
export const entriesTable = () => db.table<Entry, string>('entries')
export const articlesTable = () => db.table<Article, string>('articles')

db.version(1).stores({
  preferences: '&id',
  entries: '&id,createdAt,displayOrder',
  articles: '&id,createdAt,name'
})

export const ensureEntriesSeed = async () => {
  const entries = entriesTable()
  await db.transaction('rw', entries, async () => {
    const count = await entries.count()
    if (count > 0) return

    await entries.add({
      id: nanoid(),
      createdAt: Date.now(),
      displayOrder: generateKeyBetween(null, null),
      type: 'section',
      name: '',
      kcal: NaN,
      total: NaN,
      discard: false,
      hide: false
    })
  })
}
