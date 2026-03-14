import { useEffect, useRef } from 'preact/hooks'
import { Trans, useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import styles from './Calculator.module.css'
import MagnifyingGlassIcon from 'src/assets/icons/magnifying-glass.svg?react'
import FloppyDiskIcon from 'src/assets/icons/floppy-disk.svg?react'
import TrashIcon from 'src/assets/icons/trash.svg?react'
import { SEARCH_URL } from 'src/config/general'
import { useDialogsContext } from 'src/providers/DialogsProvider'
import { useStoreContext } from 'src/providers/StoreProvider'
import { Article, ArticleType, EntryType } from 'src/services/types'
import { useLanguage } from 'src/libs/i18n'
import { cn } from 'src/libs/tw'
import Combobox from 'src/components/inputs/Combobox'
import { extractFoodName } from './helpers'
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
  const { toast, dialog } = useDialogsContext()
  const inputNameRef = useRef<HTMLInputElement>(null)
  const articleIdRef = useRef('')
  const nameChangedRef = useRef(false)

  const handleSelectArticle = async (articleId: string) => {
    const article = await searchArticleById(articleId)
    if (!article) return
    articleIdRef.current = article.id
    nameChangedRef.current = false

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
    const saveArticle = async (article?: Article) => {
      nameChangedRef.current = false

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
        message: article
          ? t`homePage:article-saved`
          : t`homePage:article-created`
      })
    }

    const saveArticleById = async () => {
      const article = await searchArticleById(articleIdRef.current)
      saveArticle(article)
    }

    const saveArticleByName = async () => {
      const article = await searchArticleByName(entry.name)
      saveArticle(article)
    }

    if (articleIdRef.current && nameChangedRef.current) {
      dialog({
        body: t`homePage:article-name-changed`,
        actions: (close) => (
          <>
            <button type="button" onClick={close} class="btn">
              {t`common:cancel`}
            </button>
            <button
              type="button"
              onClick={() => {
                saveArticleById()
                close()
              }}
              class="btn btn-primary"
            >
              {t`common:save`}
            </button>
            <button
              type="button"
              onClick={() => {
                saveArticleByName()
                close()
              }}
              class="btn btn-primary"
            >
              {t`homePage:create-new-ingredient`}
            </button>
          </>
        )
      })
    } else {
      const article = articleIdRef.current
        ? await searchArticleById(articleIdRef.current)
        : await searchArticleByName(entry.name)
      saveArticle(article)
    }
  }

  const handleSearchArticle = () => {
    const q = extractFoodName(entry.name)
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
            placeholder={t`homePage:entry-name`}
            value={entry.name}
            onInput={debouncedSave}
            onChange={(e) => {
              onEntryChange({ ...entry, name: e.currentTarget.value })
              nameChangedRef.current = true
            }}
            onBlur={save}
            options={
              articles.length > 0 ? articles : [{ id: 'no-saved-articles' }]
            }
            renderOption={(option, onMouseDown) => {
              if (option.id == 'no-saved-articles') {
                return (
                  <div class="block">
                    <Trans
                      i18nKey="homePage:no-saved-articles"
                      components={[
                        <span key={0} class="font-semibold" />,
                        <FloppyDiskIcon key={1} className="size-5 inline" />
                      ]}
                    />
                  </div>
                )
              }

              return (
                <div class="flex gap-1">
                  <button
                    onClick={onMouseDown}
                    class="cursor-pointer whitespace-nowrap grow self-stretch flex items-center"
                  >
                    {option.name}
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => deleteArticle(option.id)}
                    class="btn btn-ghost btn-square btn-sm -mr-1"
                  >
                    <TrashIcon />
                  </button>
                </div>
              )
            }}
            onSelectOption={(option) => handleSelectArticle(option.id)}
            class="w-full"
          />
          <button
            onClick={handleSearchArticle}
            title={t`homePage:search-article`}
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
            placeholder={t`homePage:entry-kcal`}
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
            <option value="kcalPer100g">{t`homePage:kcal-per-100g`}</option>
            <option value="kcalPerUnit">{t`homePage:kcal-per-unit`}</option>{' '}
          </select>
        </div>
      </td>
      <td class={styles.compact}>
        <div class="flex items-center gap-1.5">
          <input
            type="number"
            step={entry.type == 'kcalPer100g' ? 5 : 1}
            placeholder={t`homePage:entry-total`}
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
            disabled={!entry.name.trim()}
            type="button"
            onClick={handleSaveArticle}
            title={t`homePage:save-article`}
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
