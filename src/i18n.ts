import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import es from './locales/es.json'
import en from './locales/en.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import pt from './locales/pt.json'
import ptBR from './locales/pt-BR.json'
import it from './locales/it.json'

const isDev = import.meta.env.DEV

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.split('-')[0]
})

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      'pt-BR': ['pt', 'en'],
      'default': ['en']
    },
    resources: { es, en, fr, de, pt, 'pt-BR': ptBR, it },
    ns: ['common', 'homePage'],
    defaultNS: 'none',
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      caches: ['localStorage']
    },
    appendNamespaceToMissingKey: true,
    parseMissingKeyHandler: (key) => {
      return isDev ? `{{${key}}}` : key
    }
  })

export default i18n
