import { Trans, useTranslation } from 'react-i18next'
import styles from './Calculator.module.css'
import ImportIcon from '../../assets/icons/import.svg?react'
import ExportIcon from '../../assets/icons/export.svg?react'
import Cog6ToothIcon from '../../assets/icons/cog-6-tooth.svg?react'
import RocketLaunchIcon from '../../assets/icons/rocket-launch.svg?react'
import MinusIcon from '../../assets/icons/minus.svg?react'
import PlusIcon from '../../assets/icons/plus.svg?react'
import ArrowsUpDownIcon from '../../assets/icons/arrows-up-down.svg?react'
import PlusCircleIcon from '../../assets/icons/plus-circle.svg?react'
import TrashIcon from '../../assets/icons/trash.svg?react'
import { cn } from '../../libs/tw'
import { useStoreContext } from '../../providers/StoreProvider'
import { useSettingsContext } from '../../providers/SettingsProvider'
import Menu, { MenuButton, MenuDivider } from '../../components/navigation/Menu'
import { useCalculatorContext } from './Calculator.context'
import useStickyDetection from './useStickyDetection'
import { useCurrentDate, useSortable } from './helpers'
import Row from './Row'

function CalculatorDesktop() {
  const { t } = useTranslation()
  const { goal } = useSettingsContext()
  const { totalSum, putEntry } = useStoreContext()
  const {
    visibleEntryList,
    showEditGoalDialog,
    importArticles,
    exportArticles,
    clearEntries,
    moveEntry,
    addEntry,
    deleteEntry
  } = useCalculatorContext()
  const curDate = useCurrentDate()
  const { tableRef, isStuck } = useStickyDetection()
  const totalLeft = goal - totalSum

  const handleKeydown = (e: KeyboardEvent, entryId: string) => {
    if (e.ctrlKey && e.key == '+') {
      addEntry(entryId, 'kcalPer100g')
    }
  }

  const { ref: entriesRef } = useSortable<HTMLTableSectionElement>({
    draggable: 'tr',
    handle: '.handle',
    onEnd: (e) => moveEntry({ fromIndex: e.oldIndex, toIndex: e.newIndex })
  })

  return (
    <table ref={tableRef} class={styles.entries}>
      <thead
        class={cn(
          'sticky top-0 bg-base-100 z-10 transition-shadow duration-200',
          isStuck && 'shadow-md'
        )}
      >
        <tr>
          <th class={styles.compact}>&nbsp;</th>
          <th colSpan={5} class="text-xl font-medium">
            <div class="flex flex-row justify-between items-end">
              <div>{curDate}</div>
              {isNaN(totalLeft) ? (
                <div>{t('kcal', { d: totalSum.toFixed(2) })}</div>
              ) : (
                <div class="flex flex-col items-end">
                  <span
                    class={cn('space-x-0.5', { 'text-warning': totalLeft < 0 })}
                  >
                    <Trans
                      i18nKey="kcal-budget"
                      values={{ d: totalLeft.toFixed(2) }}
                      components={[
                        <span key={0} class="text-lg font-normal" />,
                        <span key={1} />
                      ]}
                    />
                  </span>
                  <span class="text-xs">
                    {goal.toFixed(2)} - {t('kcal', { d: totalSum.toFixed(2) })}
                  </span>
                </div>
              )}
            </div>
          </th>
          <th colSpan={2} class="text-right">
            <div class="inline-flex gap-1.5">
              <button
                type="button"
                onClick={clearEntries}
                title={t`delete-all-entries`}
                class="btn btn-square btn-warning"
              >
                <TrashIcon />
              </button>
              <Menu
                anchor={({ toggle }) => (
                  <button type="button" onClick={toggle} class="btn btn-square">
                    <Cog6ToothIcon />
                  </button>
                )}
                class="dropdown-end"
              >
                <MenuButton onClick={showEditGoalDialog}>
                  <RocketLaunchIcon />
                  <span class="text-nowrap">{t`goal-kcal`}</span>
                </MenuButton>
                <MenuDivider />
                <MenuButton onClick={importArticles}>
                  <ImportIcon />
                  <span class="text-nowrap">{t`import-ingredients`}</span>
                </MenuButton>
                <MenuButton onClick={exportArticles}>
                  <ExportIcon />
                  <span class="text-nowrap">{t`export-ingredients`}</span>
                </MenuButton>
              </Menu>
            </div>
          </th>
        </tr>
      </thead>
      <tbody ref={entriesRef}>
        {visibleEntryList.map((entry, i) => (
          <tr key={entry.id} onKeyDown={(e) => handleKeydown(e, entry.id)}>
            <td
              class={cn(
                'handle cursor-grab active:cursor-grabbing',
                styles.compact
              )}
            >
              <ArrowsUpDownIcon className="size-4" />
            </td>
            <Row
              entry={entry}
              autoFocus={i == visibleEntryList.length - 1}
              onSave={putEntry}
            />
            <td class={styles.compact}>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => deleteEntry(entry.id)}
                  title={t`remove`}
                  class="btn btn-square"
                >
                  <MinusIcon className="size-4" />
                </button>
                <div class="join">
                  <button
                    type="button"
                    onClick={() => addEntry(entry.id, 'kcalPer100g')}
                    title={t`new-article`}
                    class="btn btn-square join-item"
                  >
                    <PlusIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => addEntry(entry.id, 'section')}
                    title={t`new-section`}
                    class="btn btn-square join-item"
                  >
                    <PlusCircleIcon className="size-5" />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CalculatorDesktop
