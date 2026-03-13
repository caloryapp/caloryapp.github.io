import { nanoid } from 'nanoid'
import { Article } from 'src/services/types'

export const truncateText = (text: string, maxCols: number) => {
  if (maxCols > 1 && text.length > maxCols) {
    return `${text.substring(0, maxCols - 1)}…`
  }
  return text
}

export const importArticles = (): Promise<Article[]> =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.oncancel = () => reject('no files selected')
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) {
        resolve([])
        return
      }
      const items = JSON.parse(await file.text())
      const articles: Article[] = []
      for (const item of items) {
        if (!item.name) continue
        articles.push({
          id: nanoid(),
          createdAt: Date.now(),
          type:
            item.type == 'kcalPer100g' || item.type == 'kcalPerUnit'
              ? item.type
              : 'kcalPer100g',
          name: `${item.name}`,
          kcal: parseFloat(`${item.kcal}`),
          total: parseFloat(`${item.total}`)
        })
      }
      resolve(articles)
    }
    input.click()
  })

export const exportArticles = (articleList: Article[], fileName: string) => {
  const items = articleList.map((article) => ({
    type: article.type,
    name: article.name,
    kcal: article.kcal,
    total: article.total
  }))
  const json = JSON.stringify(items, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
