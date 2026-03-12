const theme = localStorage.getItem('theme')
document.documentElement.setAttribute('data-theme', theme || 'light')

const stored = localStorage.getItem('i18nextLng')
const lang = stored ? stored.split('-')[0] : 'en'
document.documentElement.setAttribute('lang', lang)
