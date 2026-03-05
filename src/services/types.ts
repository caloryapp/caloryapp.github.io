export type EntryType = 'section' | 'kcalPer100g' | 'kcalPerUnit'
export type ArticleType = 'kcalPer100g' | 'kcalPerUnit'

export type Preferences = {
  goal: number
}

export type Article = {
  id: string
  createdAt: number
  type: ArticleType
  name: string
  kcal: number
  total: number
}

export type Entry = {
  id: string
  createdAt: number
  displayOrder: string
  type: EntryType
  name: string
  kcal: number
  total: number
  discard: boolean // discarded from calorie computation (default is `false`)
  hide: boolean
}
