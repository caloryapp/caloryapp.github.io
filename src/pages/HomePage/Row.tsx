import { useCallback, useId, useMemo, useRef, useState } from 'preact/hooks'
import { useDebouncedCallback } from 'use-debounce'
import styles from './Calculator.module.css'
import { Entry } from 'src/services/types'
import { useStoreContext } from 'src/providers/StoreProvider'
import { AUTOSAVE_DELAY } from 'src/config/general'
import { cn } from 'src/libs/tw'
import { RowContext, RowContextProps, useRowContext } from './Row.context'
import RowSection from './RowSection'
import RowEntry from './RowEntry'
import { useTranslation } from 'react-i18next'

type RowProps = {
  autoFocus: boolean
  entry: Entry
  onSave: (entry: Entry) => void
}

const Row = () => {
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
        <label
          class={cn('text-right text-sm', {
            'font-medium text-base md:text-lg': type == 'section',
            'line-through opacity-50': entry.discard
          })}
          htmlFor={inputId}
        >
          {t('homePage:kcal', { d: totalSum.toFixed(2) })}
        </label>
      </td>
      <td class={styles.compact}>
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
