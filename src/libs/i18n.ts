import { useTranslation } from 'react-i18next'
import { SEARCH_URL } from 'src/config/general'

type SupportedLanguage = keyof typeof SEARCH_URL

export const useLanguage = (): SupportedLanguage => {
  const { i18n } = useTranslation()
  const lang = i18n.language.split('-')[0] || 'en'
  if (lang in SEARCH_URL) {
    return lang as SupportedLanguage
  }
  return 'en'
}
