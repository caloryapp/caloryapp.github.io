import { useTranslation } from 'react-i18next'
import { useSettingsDialogContext } from './SettingsDialog.context'

const SectionGoal = () => {
  const { t } = useTranslation()
  const { setChanged, data, setData } = useSettingsDialogContext()

  const handleInput = (e: Event & { currentTarget: HTMLInputElement }) => {
    setData((val) => ({ ...val, goal: e.currentTarget.value }))
    setChanged(true)
  }

  return (
    <label class="floating-label">
      <span>{t`caloric-goal`}</span>
      <input
        type="number"
        autoFocus
        placeholder={t`caloric-goal`}
        value={data.goal}
        onInput={handleInput}
        class="input w-full"
      />
    </label>
  )
}

export default SectionGoal
