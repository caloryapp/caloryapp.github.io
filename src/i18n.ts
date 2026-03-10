import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import es from './locales/es.json'
import en from './locales/en.json'

const isDev = import.meta.env.DEV

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.split('-')[0]
})

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      es: { translation: es },
      en: { translation: en }
    },
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      caches: ['localStorage']
    },
    parseMissingKeyHandler: (key) => {
      return isDev ? `{{${key}}}` : key
    }
  })

export default i18n
