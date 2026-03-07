import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import RocketLaunchIcon from '../../assets/icons/rocket-launch.svg?react'
import MagnifyingGlassIcon from '../../assets/icons/magnifying-glass.svg?react'
import { cn } from '../../libs/tw'
import { useStoreContext } from '../../providers/StoreProvider'
import Dialog from '../../components/feedback/Dialog'
import {
  Data,
  SettingsDialogContext,
  SettingsDialogContextProps,
  useSettingsDialogContext
} from './SettingsDialog.context'
import SectionGoal from './SectionGoal'
import SectionSearchUrl from './SectionSearchUrl'

type ActiveTab = 'goal' | 'search-url'

export type SettingsDialogProps = {
  open: boolean
  onClose: () => void
}

const SettingsDialog = () => {
  const { t } = useTranslation()
  const { changed, open, onClose, save } = useSettingsDialogContext()
  const [activeTab, setActiveTab] = useState<ActiveTab>('goal')

  useEffect(() => {
    if (!open) return
    setActiveTab('goal')
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      header={t`settings`}
      actions={
        <>
          <button type="button" onClick={onClose} class="btn">
            {t`cancel`}
          </button>
          <button
            type="button"
            disabled={!changed}
            onClick={save}
            class="btn btn-primary"
          >
            {t`save`}
          </button>
        </>
      }
    >
      <div class="tabs tabs-border pb-10">
        <button
          onClick={() => setActiveTab('goal')}
          class={cn('tab space-x-1.5', {
            'tab-active': activeTab == 'goal'
          })}
        >
          <RocketLaunchIcon className="size-5" />
          <span>{t`goal`}</span>
        </button>
        <button
          onClick={() => setActiveTab('search-url')}
          class={cn('tab space-x-1.5', {
            'tab-active': activeTab == 'search-url'
          })}
        >
          <MagnifyingGlassIcon className="size-5" />
          <span>{t`search-url`}</span>
        </button>
      </div>
      <div class="px-3">
        {activeTab == 'goal' && <SectionGoal />}
        {activeTab == 'search-url' && <SectionSearchUrl />}
      </div>
    </Dialog>
  )
}

const SettingsDialogProvider = ({ open, onClose }: SettingsDialogProps) => {
  const { preferences, updatePreferences } = useStoreContext()
  const [changed, setChanged] = useState(false)
  const [data, setData] = useState<Data>({
    goal: '',
    searchUrl: ''
  })

  const handleSave = useCallback(() => {
    updatePreferences({
      goal: Number.parseFloat(data.goal),
      searchUrl: data.searchUrl.trim()
    })
    setChanged(false)
  }, [data.goal, data.searchUrl, updatePreferences])

  const goal = Number.isNaN(preferences.goal) ? '' : `${preferences.goal}`
  useEffect(() => {
    setData((val) => ({ ...val, goal, searchUrl: preferences.searchUrl }))
  }, [goal, preferences.searchUrl, setData])

  const ctxValue = useMemo<SettingsDialogContextProps>(
    () => ({
      open,
      onClose,
      changed,
      setChanged,
      data,
      setData,
      save: handleSave
    }),
    [open, changed, data, handleSave, onClose]
  )

  return (
    <SettingsDialogContext value={ctxValue}>
      <SettingsDialog />
    </SettingsDialogContext>
  )
}

export default SettingsDialogProvider
