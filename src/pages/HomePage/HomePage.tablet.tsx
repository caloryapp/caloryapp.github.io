import { Trans, useTranslation } from 'react-i18next'
import styles from './HomePage.module.css'
import ImportIcon from 'src/assets/icons/import.svg?react'
import ExportIcon from 'src/assets/icons/export.svg?react'
import Cog6ToothIcon from 'src/assets/icons/cog-6-tooth.svg?react'
import QuestionMarkCircleIcon from 'src/assets/icons/question-mark-circle.svg?react'
import RocketLaunchIcon from 'src/assets/icons/rocket-launch.svg?react'
import MinusIcon from 'src/assets/icons/minus.svg?react'
import PlusIcon from 'src/assets/icons/plus.svg?react'
import ArrowsUpDownIcon from 'src/assets/icons/arrows-up-down.svg?react'
import PlusCircleIcon from 'src/assets/icons/plus-circle.svg?react'
import EllipsisHorizontalCircle from 'src/assets/icons/ellipsis-horizontal-circle.svg?react'
import TrashIcon from 'src/assets/icons/trash.svg?react'
import { cn } from 'src/libs/tw'
import { useIsTablet } from 'src/libs/mq'
import { useStoreContext } from 'src/providers/StoreProvider'
import { useSettingsContext } from 'src/providers/SettingsProvider'
import { useDialogsContext } from 'src/providers/DialogsProvider'
import PageLayout from 'src/layouts/PageLayout'
import Menu, { MenuButton, MenuDivider } from 'src/components/navigation/Menu'
import { useCurrentDate, useSortable, useStickyDetection } from './helpers'
import { useHomePageContext } from './HomePage.context'
import Row from './Row'

function HomePageTablet() {
  const { t } = useTranslation()
  const { goal } = useSettingsContext()
  const { totalSum, putEntry } = useStoreContext()
  const {
    visibleEntryList,
    helpMode,
    setHelpMode,
    showEditGoalDialog,
    importArticles,
    exportArticles,
    clearEntries,
    moveEntry,
    addEntry,
    deleteEntry
  } = useHomePageContext()
  const curDate = useCurrentDate()
  const { tableRef, isStuck } = useStickyDetection()
  const { dialog } = useDialogsContext()
  const isTablet = useIsTablet()
  const totalLeft = goal - totalSum

  const handleKeydown = (e: KeyboardEvent, entryId: string) => {
    if (e.ctrlKey && e.key == '+') {
      addEntry(entryId, 'kcalPer100g')
    }
  }

  const handleToggleHelpMode = (
    e: Event & { currentTarget: HTMLInputElement }
  ) => {
    const checked = e.currentTarget.checked
    if (checked) {
      dialog({
        // body: t('tooltip:help-mode-activated'),
        body: (
          <Trans
            i18nKey="tooltip:help-mode-activated"
            components={[<strong key={0} />]}
          />
        ),
        actions: (close) => (
          <button type="button" onClick={close} class="btn btn-primary">
            {t`common:accept`}
          </button>
        )
      })
    }
    setHelpMode(checked)
  }

  const { ref: entriesRef } = useSortable<HTMLTableSectionElement>({
    draggable: 'tr',
    handle: '.handle',
    onEnd: (e) => moveEntry({ fromIndex: e.oldIndex, toIndex: e.newIndex })
  })

  return (
    <PageLayout>
      <table ref={tableRef} class={styles.entries}>
        <thead
          class={cn(
            'sticky top-0 bg-base-100 z-10 transition-shadow duration-200',
            isStuck && 'shadow-md'
          )}
        >
          <tr>
            <th class={styles.compact}>&nbsp;</th>
            <th colSpan={5} class="text-base md:text-lg lg:text-xl font-medium">
              <div class="flex flex-row justify-between items-end">
                <div>{curDate}</div>
                {isNaN(totalLeft) ? (
                  <div
                    class={cn('tooltip-bottom', { tooltip: helpMode })}
                    data-tip={t`tooltip:total-calories`}
                  >
                    {t('homePage:kcal', { d: totalSum.toFixed(2) })}
                  </div>
                ) : (
                  <div
                    class={cn('flex flex-col items-end tooltip-bottom', {
                      tooltip: helpMode
                    })}
                    data-tip={t`tooltip:remaining-calories`}
                  >
                    <span
                      class={cn('space-x-0.5', {
                        'text-warning': totalLeft < 0
                      })}
                    >
                      <Trans
                        i18nKey="homePage:kcal-budget"
                        values={{ d: totalLeft.toFixed(2) }}
                        components={[
                          <span
                            key={0}
                            class="text-base md:text-lg font-normal"
                          />,
                          <span key={1} />
                        ]}
                      />
                    </span>
                    <span class="text-xs">
                      {goal.toFixed(2)} -{' '}
                      {t('homePage:kcal', { d: totalSum.toFixed(2) })}
                    </span>
                  </div>
                )}
              </div>
            </th>
            <th colSpan={2} class="text-right">
              <div class="inline-flex gap-1.5">
                <div
                  class={cn('tooltip-left font-normal', { tooltip: helpMode })}
                  data-tip={t`tooltip:clean-table`}
                >
                  <button
                    type="button"
                    onClick={clearEntries}
                    aria-label={t`homePage:delete-all-entries`}
                    class="btn btn-sm md:btn-md btn-square btn-warning"
                  >
                    <TrashIcon />
                  </button>
                </div>
                <div class="join">
                  <label
                    title={t`homePage:help-mode`}
                    class={cn(
                      'join-item btn btn-sm md:btn-md btn-square swap',
                      {
                        'bg-primary text-primary-content border-0': helpMode
                      }
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={helpMode}
                      onInput={handleToggleHelpMode}
                    />
                    <QuestionMarkCircleIcon className="size-6" />
                  </label>
                  <Menu
                    anchor={({ toggle }) => (
                      <button
                        type="button"
                        onClick={toggle}
                        class="join-item btn btn-sm md:btn-md btn-square"
                      >
                        <Cog6ToothIcon />
                      </button>
                    )}
                    class="join-item dropdown-end"
                  >
                    <MenuButton onClick={showEditGoalDialog}>
                      <RocketLaunchIcon />
                      <span class="text-nowrap">{t`homePage:goal-kcal`}</span>
                    </MenuButton>
                    <MenuDivider />
                    <MenuButton onClick={importArticles}>
                      <ImportIcon />
                      <span class="text-nowrap">{t`homePage:import-ingredients`}</span>
                    </MenuButton>
                    <MenuButton onClick={exportArticles}>
                      <ExportIcon />
                      <span class="text-nowrap">{t`homePage:export-ingredients`}</span>
                    </MenuButton>
                  </Menu>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody ref={entriesRef}>
          {visibleEntryList.map((entry, i) => (
            <tr key={entry.id} onKeyDown={(e) => handleKeydown(e, entry.id)}>
              <td
                class={cn(
                  styles.compact,
                  'handle cursor-grab active:cursor-grabbing'
                )}
                aria-label="homePage:drag-row"
              >
                <span
                  class={cn('tooltip-right', { tooltip: helpMode })}
                  data-tip={t`tooltip:drag-rows`}
                >
                  <ArrowsUpDownIcon className="size-4" />
                </span>
              </td>
              <Row
                entry={entry}
                autoFocus={i == visibleEntryList.length - 1}
                onSave={putEntry}
              />
              <td class={cn(styles.compact, 'text-right')}>
                {isTablet ? (
                  <Menu
                    anchor={({ toggle }) => (
                      <button
                        type="button"
                        onClick={toggle}
                        class="btn btn-sm md:btn-md btn-square"
                        aria-label={t`homePage:entry-actions`}
                      >
                        <EllipsisHorizontalCircle className="size-5" />
                      </button>
                    )}
                    class="dropdown-end"
                    aria-label={t`homePage:entry-actions`}
                  >
                    <MenuButton onClick={() => deleteEntry(entry.id)}>
                      <MinusIcon className="size-5" />
                      <span class="text-nowrap">{t`homePage:remove-entry`}</span>
                    </MenuButton>
                    <MenuDivider />
                    <MenuButton
                      onClick={() => addEntry(entry.id, 'kcalPer100g')}
                    >
                      <PlusIcon className="size-5" />
                      <span class="text-nowrap">{t`homePage:add-entry`}</span>
                    </MenuButton>
                    <MenuButton onClick={() => addEntry(entry.id, 'section')}>
                      <PlusCircleIcon className="size-5" />
                      <span class="text-nowrap">{t`homePage:add-section`}</span>
                    </MenuButton>
                  </Menu>
                ) : (
                  <div class="flex items-center gap-1.5">
                    <div
                      class={cn('tooltip-left', { tooltip: helpMode })}
                      data-tip={
                        entry.type == 'section'
                          ? t`tooltip:delete-section`
                          : t`tooltip:delete-entry`
                      }
                    >
                      <button
                        type="button"
                        onClick={() => deleteEntry(entry.id)}
                        class="btn btn-square"
                        aria-label={t`homePage:remove-entry`}
                      >
                        <MinusIcon className="size-4" />
                      </button>
                    </div>
                    <div class="join">
                      <div
                        class={cn('join-item tooltip-left', {
                          tooltip: helpMode
                        })}
                        data-tip={t`tooltip:add-ingredient`}
                      >
                        <button
                          type="button"
                          onClick={() => addEntry(entry.id, 'kcalPer100g')}
                          class="btn btn-square join-item"
                          aria-label={t`homePage:add-entry`}
                        >
                          <PlusIcon className="size-4" />
                        </button>
                      </div>
                      <div
                        class={cn('join-item tooltip-left', {
                          tooltip: helpMode
                        })}
                        data-tip={t`tooltip:add-section`}
                      >
                        <button
                          type="button"
                          onClick={() => addEntry(entry.id, 'section')}
                          class="btn btn-square join-item"
                          aria-label={t`homePage:add-section`}
                        >
                          <PlusCircleIcon className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageLayout>
  )
}

export default HomePageTablet
