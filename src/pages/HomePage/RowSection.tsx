import { useEffect, useRef } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import ChevronUpIcon from 'src/assets/icons/chevron-up.svg?react'
import { cn } from 'src/libs/tw'
import { useStoreContext } from 'src/providers/StoreProvider'
import styles from './Calculator.module.css'
import { useCalculatorContext } from './Calculator.context'
import { useRowContext } from './Row.context'

const RowSection = () => {
  const { t } = useTranslation()
  const { toggleSection, isSectionCollapsed, isSectionEmpty } =
    useStoreContext()
  const { focusIdRef } = useCalculatorContext()
  const { autoFocus, entry, onEntryChange, save, debouncedSave } =
    useRowContext()
  const collapsed = isSectionCollapsed(entry.id)
  const empty = isSectionEmpty(entry.id)
  const inputNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusIdRef.current === entry.id) {
      inputNameRef.current?.focus()
      focusIdRef.current = ''
    }
  }, [focusIdRef, entry.id])

  return (
    <>
      <td colSpan={3}>
        <input
          autoFocus={autoFocus}
          ref={inputNameRef}
          type="text"
          placeholder={t`section-name`}
          value={entry.name}
          onInput={debouncedSave}
          onChange={(e) =>
            onEntryChange({ ...entry, name: e.currentTarget.value })
          }
          onBlur={save}
          aria-label={t`section-name`}
          class="input w-full col-span-3 border-2 border-primary/50 outline-primary"
        />
      </td>
      <td class={styles.compact}>
        <button
          type="button"
          disabled={empty}
          onClick={() => toggleSection(entry.id)}
          class={cn(
            'btn btn-square btn-link text-base-content btn-sm transition-[rotate]',
            {
              'opacity-0': empty,
              'rotate-180': collapsed
            }
          )}
        >
          <ChevronUpIcon />
        </button>
      </td>
    </>
  )
}

export default RowSection
