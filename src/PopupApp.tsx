import { useTranslation } from 'react-i18next'

const PopupApp = () => {
  const { t } = useTranslation()

  const openInFullTab = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html')
    })
  }

  return (
    <button
      id="openFullTab"
      class="btn btn-sm btn-neutral whitespace-nowrap"
      onClick={openInFullTab}
    >
      {t`popup:open-caloryapp`}
    </button>
  )
}

export default PopupApp
