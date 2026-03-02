import { useCallback, useId, useMemo, useState } from 'preact/hooks'
import { useDebouncedCallback } from 'use-debounce'
import styles from './Calculator.module.css'
import { Entry } from '../services/types'
import { useStoreContext } from '../providers/StoreProvider'
import { AUTOSAVE_DELAY } from '../config'
import { cn } from '../libs/tw'
import { RowContext, RowContextProps, useRowContext } from './Row.context'
import RowSection from './RowSection'
import RowEntry from './RowEntry'
import { useTranslation } from 'react-i18next'

type RowProps = {
  autoFocus: boolean
  entry: Entry
  onSave: (entry: Entry) => void
}

const RowRouter = () => {
  const { t } = useTranslation()
  const { getTotalSum } = useStoreContext()
  const { entry, onEntryChange, debouncedSave } = useRowContext()
  const type = entry.type
  const totalSum = getTotalSum(entry.id)
  const inputId = useId()

  return (
    <>
      {type == 'section' && <RowSection />}
      {(type == 'kcalPer100g' || type == 'kcalPerUnit') && <RowEntry />}
      <td class={cn('text-right whitespace-nowrap', styles.compact)}>
        {!isNaN(totalSum) && (
          <label
            class={cn('text-right', {
              'font-medium text-lg': type == 'section',
              'line-through opacity-50': entry.discard
            })}
            htmlFor={inputId}
          >
            {t('kcal', { d: totalSum.toFixed(2) })}
          </label>
        )}
      </td>
      <td class={styles.compact}>
        {(type == 'kcalPer100g' || type == 'kcalPerUnit') && (
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
        )}
      </td>
    </>
  )
}

const Row = ({ autoFocus, entry: entryParam, onSave }: RowProps) => {
  const [entry, setEntry] = useState<Entry>(entryParam)
  const save = useCallback(
    () => onSave({ ...entry, displayOrder: entryParam.displayOrder }),
    [entry, entryParam, onSave]
  )
  const debouncedSave = useDebouncedCallback(save, AUTOSAVE_DELAY)

  const ctxValue = useMemo<RowContextProps>(
    () => ({
      autoFocus,
      entry,
      onEntryChange: setEntry,
      save,
      debouncedSave
    }),
    [autoFocus, entry, save, debouncedSave]
  )

  return (
    <RowContext value={ctxValue}>
      <RowRouter />
    </RowContext>
  )
}

export default Row
