import { useCallback, useId, useMemo, useRef, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { useDebouncedCallback } from 'use-debounce'
import styles from './HomePage.module.css'
import { Entry } from 'src/services/types'
import { useStoreContext } from 'src/providers/StoreProvider'
import { AUTOSAVE_DELAY } from 'src/config/general'
import { cn } from 'src/libs/tw'
import { useHomePageContext } from './HomePage.context'
import { RowContext, RowContextProps, useRowContext } from './Row.context'
import RowSection from './RowSection'
import RowEntry from './RowEntry'

type RowProps = {
  autoFocus: boolean
  entry: Entry
  onSave: (entry: Entry) => void
}

const Row = () => {
  const { t } = useTranslation()
  const { getTotalSum } = useStoreContext()
  const { entry, onEntryChange, debouncedSave } = useRowContext()
  const { helpMode } = useHomePageContext()
  const type = entry.type
  const totalSum = getTotalSum(entry.id)
  const inputId = useId()

  return (
    <>
      {type == 'section' && <RowSection />}
      {(type == 'kcalPer100g' || type == 'kcalPerUnit') && <RowEntry />}
      <td class={cn('text-right whitespace-nowrap', styles.compact)}>
        <label
          class={cn('text-right text-sm tooltip-bottom', {
            'font-medium text-base md:text-lg': type == 'section',
            'md:text-base': type == 'kcalPer100g' || type == 'kcalPerUnit',
            'line-through opacity-50': entry.discard,
            'tooltip': helpMode
          })}
          htmlFor={inputId}
          data-tip={
            type == 'section'
              ? t`tooltip:kcal-per-section`
              : entry.type == 'kcalPer100g'
                ? t`tooltip:kcal-per-100g`
                : t`tooltip:kcal-per-unit`
          }
        >
          {t('homePage:kcal', { d: totalSum.toFixed(2) })}
        </label>
      </td>
      <td class={styles.compact}>
        <div
          class={cn('tooltip-bottom', { tooltip: helpMode })}
          data-tip={t`tooltip:discard-entry`}
        >
          <input
            id={inputId}
            key={entry.discard} // force remounting (issue preact/issues/1899)
            type="checkbox"
            checked={!entry.discard}
            onInput={debouncedSave}
            onChange={(e) => {
              onEntryChange({
                ...entry,
                discard: !e.currentTarget.checked
              })
            }}
            class="toggle toggle-xs mb-1"
          />
        </div>
      </td>
    </>
  )
}

const RowProvider = ({ autoFocus, entry: entryParam, onSave }: RowProps) => {
  const [entry, setEntry] = useState<Entry>(entryParam)
  const hasChangedRef = useRef(false)
  const save = useCallback(() => {
    if (!hasChangedRef.current) return
    hasChangedRef.current = false
    onSave({ ...entry, displayOrder: entryParam.displayOrder })
  }, [entry, entryParam, onSave])
  const debouncedSave = useDebouncedCallback(save, AUTOSAVE_DELAY)

  const ctxValue = useMemo<RowContextProps>(
    () => ({
      autoFocus,
      entry,
      onEntryChange: (val) => {
        hasChangedRef.current = true
        setEntry(val)
      },
      save,
      debouncedSave
    }),
    [autoFocus, entry, save, debouncedSave]
  )

  return (
    <RowContext value={ctxValue}>
      <Row />
    </RowContext>
  )
}

export default RowProvider
