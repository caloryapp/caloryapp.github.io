import { useEffect, useRef } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import styles from './Calculator.module.css'
import MagnifyingGlassIcon from '../../assets/icons/magnifying-glass.svg?react'
import FloppyDiskIcon from '../../assets/icons/floppy-disk.svg?react'
import TrashIcon from '../../assets/icons/trash.svg?react'
import { SEARCH_URL } from '../../config/general'
import { useDialogsContext } from '../../providers/DialogsProvider'
import { useStoreContext } from '../../providers/StoreProvider'
import { ArticleType, EntryType } from '../../services/types'
import { useLanguage } from '../../libs/i18n'
import { cn } from '../../libs/tw'
import Combobox from '../../components/inputs/Combobox'
import { useCalculatorContext } from './Calculator.context'
import { useRowContext } from './Row.context'

const RowEntry = () => {
  const { t } = useTranslation()
  const lang = useLanguage()
  const {
    putArticle,
    deleteArticle,
    putEntry,
    searchArticleById,
    searchArticleByName
  } = useStoreContext()
  const { focusIdRef, articles } = useCalculatorContext()
  const { autoFocus, entry, onEntryChange, save, debouncedSave } =
    useRowContext()
  const { toast } = useDialogsContext()
  const inputNameRef = useRef<HTMLInputElement>(null)
  const articleIdRef = useRef('')

  const handleChangeArticle = async (articleId: string) => {
    const article = await searchArticleById(articleId)
    if (!article) return
    articleIdRef.current = article.id

    const newEntry = {
      ...entry,
      name: article.name,
      kcal: article.kcal,
      total: article.total,
      type: article.type
    }
    onEntryChange(newEntry)
    await putEntry(newEntry)
  }

  const handleSaveArticle = async () => {
    const article = articleIdRef.current
      ? await searchArticleById(articleIdRef.current)
      : await searchArticleByName(entry.name)
    articleIdRef.current = article?.id || nanoid()
    await putArticle({
      id: articleIdRef.current,
      createdAt: article?.createdAt || Date.now(),
      type: entry.type as ArticleType,
      name: entry.name,
      kcal: entry.kcal,
      total: entry.total
    })

    toast({
      message: article ? t`article-saved` : t`article-created`
    })
  }

  const handleSearchArticle = () => {
    const q = entry.name.trim()
    const searchUrl = SEARCH_URL[lang] ?? 'en'
    let url = searchUrl.replace('%q', encodeURIComponent(q))
    if (!q) {
      const urlInfo = new URL(searchUrl)
      url = urlInfo.origin + urlInfo.pathname
    }
    window.open(url, '_blank', 'noreferrer')
  }

  useEffect(() => {
    if (focusIdRef.current === entry.id) {
      inputNameRef.current?.focus()
      focusIdRef.current = ''
    }
  }, [focusIdRef, entry.id])

  return (
    <>
      <td>
        <div class="flex items-center gap-1.5">
          <Combobox
            autoFocus={autoFocus}
            ref={inputNameRef}
            placeholder={t`entry-name`}
            value={entry.name}
            onInput={debouncedSave}
            onChange={(e) =>
              onEntryChange({ ...entry, name: e.currentTarget.value })
            }
            onBlur={save}
            options={articles}
            renderOption={(option, onMouseDown) => (
              <div class="flex gap-1">
                <a type="button" onMouseDown={onMouseDown} class="grow">
                  <span class="whitespace-nowrap">{option.name}</span>
                </a>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => deleteArticle(option.id)}
                  class="btn btn-ghost btn-square btn-sm -mr-1"
                >
                  <TrashIcon />
                </button>
              </div>
            )}
            onSelectOption={(option) => handleChangeArticle(option.id)}
            class="w-full"
          />
          <button
            onClick={handleSearchArticle}
            title={t`search-article`}
            class="btn btn-square"
          >
            <MagnifyingGlassIcon className="size-5" />
          </button>
        </div>
      </td>
      <td class={styles.compact}>
        <div class="join">
          <input
            type="number"
            placeholder={t`entry-kcal`}
            value={isNaN(entry.kcal) ? '' : entry.kcal}
            onInput={debouncedSave}
            onChange={(e) =>
              onEntryChange({
                ...entry,
                kcal: parseFloat(e.currentTarget.value)
              })
            }
            onBlur={save}
            class={cn('input join-item w-24', {
              'border-kcal-per-100g': entry.type == 'kcalPer100g',
              'border-kcal-per-unit': entry.type == 'kcalPerUnit'
            })}
          />
          <select
            value={entry.type}
            onInput={debouncedSave}
            onChange={(e) =>
              onEntryChange({
                ...entry,
                type: e.currentTarget.value as EntryType
              })
            }
            onBlur={save}
            class={cn('input join-item w-24', {
              'border-kcal-per-100g': entry.type == 'kcalPer100g',
              'border-kcal-per-unit': entry.type == 'kcalPerUnit'
            })}
          >
            <option value="kcalPer100g">{t`kcal-per-100g`}</option>
            <option value="kcalPerUnit">{t`kcal-per-unit`}</option>{' '}
          </select>
        </div>
      </td>
      <td class={styles.compact}>
        <div class="flex items-center gap-1.5">
          <input
            type="number"
            step={entry.type == 'kcalPer100g' ? 5 : 1}
            placeholder={t`entry-total`}
            value={isNaN(entry.total) ? '' : entry.total}
            onInput={debouncedSave}
            onChange={(e) =>
              onEntryChange({
                ...entry,
                total: parseFloat(e.currentTarget.value)
              })
            }
            onBlur={save}
            class="input w-24"
          />
          <button
            type="button"
            onClick={handleSaveArticle}
            title={t`save-article`}
            class="btn btn-square"
          >
            <FloppyDiskIcon className="size-5" />
          </button>
        </div>
      </td>
      <td>&nbsp;</td>
    </>
  )
}

export default RowEntry
