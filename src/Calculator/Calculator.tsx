import { useCallback, useMemo, useRef, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import { EntryType } from '../services/types'
import { useDialogsContext } from '../providers/DialogsProvider'
import { useStoreContext } from '../providers/StoreProvider/context'
import { CalculatorContext, CalculatorContextProps } from './Calculator.context'
import CalculatorDesktop from './Calculator.desktop'
import { exportArticles, importArticles } from './helpers'
import useDisplayOrder from './useDisplayOrder'

const Calculator = () => {
  const { t, i18n } = useTranslation()
  const focusIdRef = useRef('')
  const [focusId, setFocusId] = useState('')
  const { genOrderAfter, moveEntryBefore, moveEntryAfter } = useDisplayOrder()
  const { confirm, toast } = useDialogsContext()
  const {
    articleList,
    entryList,
    isSectionCollapsed,
    putEntry,
    deleteSection,
    deleteEntry,
    clearEntries,
    replaceArticles
  } = useStoreContext()

  const collator = useMemo(() => {
    const language = i18n.resolvedLanguage || i18n.language || 'en'
    return new Intl.Collator(language, {
      sensitivity: 'base',
      numeric: true
    })
  }, [i18n.resolvedLanguage, i18n.language])

  const articles = useMemo(() => {
    if (!articleList) return []
    return [...articleList].sort((a, b) =>
      collator.compare(a.name ?? '', b.name ?? '')
    )
  }, [articleList, collator])

  const visibleEntryList = useMemo(
    () => entryList?.filter((entry) => !entry.hide) ?? [],
    [entryList]
  )

  const handleImportArticles = useCallback(async () => {
    const articles = await importArticles()
    await replaceArticles(articles)
    toast({ message: t`import-articles-success` })
  }, [t, toast, replaceArticles])

  const handleExportArticles = useCallback(() => {
    if (!articleList) return
    const fileDate = new Date().toISOString().slice(0, 10)
    const fileName = `calory-articles-${fileDate}.json`
    exportArticles(articleList, fileName)
    toast({ message: t`export-articles-success` })
  }, [t, articleList, toast])

  const handleClearEntries = useCallback(() => {
    confirm({
      message: t`delete-entries-message`,
      onAccept: clearEntries
    })
  }, [t, confirm, clearEntries])

  const handleAddEntry = useCallback(
    async (afterEntryId: string, type: EntryType) => {
      const order = genOrderAfter(afterEntryId)
      focusIdRef.current = nanoid()
      await putEntry({
        id: focusIdRef.current,
        createdAt: Date.now(),
        displayOrder: order,
        type,
        name: '',
        kcal: NaN,
        total: NaN,
        discard: false,
        hide: false
      })
    },
    [genOrderAfter, putEntry]
  )

  const handleDeleteEntry = useCallback(
    async (entryId: string) => {
      if (isSectionCollapsed(entryId)) {
        confirm({
          message: t`delete-section`,
          onAccept: () => deleteSection(entryId)
        })
      } else {
        await deleteEntry(entryId)
      }
    },
    [t, confirm, isSectionCollapsed, deleteSection, deleteEntry]
  )

  const handleMoveEntry = useCallback(
    (params: { fromIndex?: number; toIndex?: number }) => {
      const { fromIndex, toIndex } = params
      if (
        visibleEntryList.length < 2 ||
        fromIndex === undefined ||
        toIndex === undefined ||
        fromIndex === toIndex
      ) {
        return
      }

      const fromEntry = visibleEntryList[fromIndex]
      const toEntry = visibleEntryList[toIndex]
      if (fromIndex < toIndex) {
        moveEntryAfter(fromEntry.id, toEntry.id)
      } else {
        moveEntryBefore(fromEntry.id, toEntry.id)
      }
    },
    [visibleEntryList, moveEntryBefore, moveEntryAfter]
  )

  const ctxValue = useMemo<CalculatorContextProps>(
    () => ({
      focusIdRef,
      articles,
      visibleEntryList,
      focusId,
      setFocusId,
      importArticles: handleImportArticles,
      exportArticles: handleExportArticles,
      clearEntries: handleClearEntries,
      moveEntry: handleMoveEntry,
      addEntry: handleAddEntry,
      deleteEntry: handleDeleteEntry
    }),
    [
      focusId,
      articles,
      visibleEntryList,
      handleImportArticles,
      handleExportArticles,
      handleMoveEntry,
      handleClearEntries,
      handleAddEntry,
      handleDeleteEntry
    ]
  )

  return (
    <CalculatorContext value={ctxValue}>
      <CalculatorDesktop />
    </CalculatorContext>
  )
}

export default Calculator
