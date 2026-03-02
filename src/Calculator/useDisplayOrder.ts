import { useCallback, useMemo } from 'preact/hooks'
import { generateKeyBetween, generateNKeysBetween } from 'fractional-indexing'
import { useStoreContext } from '../providers/StoreProvider'

const useDisplayOrder = () => {
  const { entryList, putEntry } = useStoreContext()

  const getOrderBounds = useCallback(
    (index: number): [string | null, string | null] => {
      if (!entryList) {
        return [null, null]
      }

      // searches for the first visible element after index and its predecessor
      let [i0, i1] = [index, -1]
      for (i1 = index + 1; i1 < entryList.length && entryList[i1].hide; i1++) {
        i0 = i1
      }

      const o1 = entryList[i0]?.displayOrder ?? null
      const o2 = entryList[i1]?.displayOrder ?? null
      return [o1, o2]
    },
    [entryList]
  )

  const genOrder = useCallback(() => {
    return generateKeyBetween(null, null)
  }, [])

  const genOrderAfter = useCallback(
    (entryId: string) => {
      if (!entryList) return ''
      const index = entryList.findIndex((entry) => entry.id == entryId)
      return generateKeyBetween(...getOrderBounds(index))
    },
    [entryList, getOrderBounds]
  )

  const moveEntry = useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (!entryList) return

      // get current entry and children
      const entries = [entryList[fromIndex]]
      for (let i = fromIndex + 1; i < entryList.length; i++) {
        if (!entryList[i].hide) break
        entries.push(entryList[i])
      }

      // updates orders
      const orders = generateNKeysBetween(
        ...getOrderBounds(toIndex),
        entries.length
      )
      await Promise.all(
        entries.map((entry, i) =>
          putEntry({ ...entry, displayOrder: orders[i] })
        )
      )
    },
    [entryList, getOrderBounds, putEntry]
  )

  const moveEntryAfter = useCallback(
    async (fromEntryId: string, toEntryId: string) => {
      if (!entryList) return
      const fromIndex = entryList.findIndex((entry) => entry.id == fromEntryId)
      const toIndex = entryList.findIndex((entry) => entry.id == toEntryId)
      moveEntry(fromIndex, toIndex)
    },
    [entryList, moveEntry]
  )

  const moveEntryBefore = useCallback(
    async (fromEntryId: string, toEntryId: string) => {
      if (!entryList) return
      const fromIndex = entryList.findIndex((entry) => entry.id == fromEntryId)
      const toIndex = entryList.findIndex((entry) => entry.id == toEntryId)
      moveEntry(fromIndex, toIndex - 1)
    },
    [entryList, moveEntry]
  )

  return useMemo(
    () => ({
      genOrder,
      genOrderAfter,
      moveEntryAfter,
      moveEntryBefore
    }),
    [genOrder, genOrderAfter, moveEntryAfter, moveEntryBefore]
  )
}

export default useDisplayOrder
