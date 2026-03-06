import { useTranslation } from 'react-i18next'
import { useSettingsDialogContext } from './SettingsDialog.context'

const SectionSearchUrl = () => {
  const { t } = useTranslation()
  const { setChanged, data, setData } = useSettingsDialogContext()

  const handleInput = (e: Event & { currentTarget: HTMLInputElement }) => {
    setData((val) => ({ ...val, searchUrl: e.currentTarget.value }))
    setChanged(true)
  }

  // TODO: implement this section
  return (
    <label class="floating-label">
      <span>{t`search-url`}</span>
      <input
        type="text"
        autoFocus
        value={data.searchUrl}
        onInput={handleInput}
        placeholder={t`search-url`}
        class="input w-full"
      />
    </label>
  )
}

export default SectionSearchUrl
