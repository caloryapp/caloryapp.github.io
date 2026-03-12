import { useTranslation, I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import CalculatorIcon from './assets/icons/calculator.svg?react'
import ChevronDownIcon from './assets/icons/chevron-down.svg?react'
import { AVAIL_THEMES } from './config/theme'
import { capitalize } from './libs/strings'
import { cn } from './libs/tw'
import ThemeProvider, { useThemeContext } from './providers/ThemeProvider'
import DialogsProvider from './providers/DialogsProvider'
import StoreProvider from './providers/StoreProvider'
import SettingsProvider from './providers/SettingsProvider'
import Menu, { MenuButton } from './components/navigation/Menu'
import CaloryApp from './CaloryApp'

const App = () => {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useThemeContext()
  const lang = i18n.language

  return (
    <div class="flex flex-col h-screen w-[calc(100%-2rem)] max-w-6xl mx-auto">
      <div class="navbar z-20">
        <div class="grow flex items-center gap-1.5 text-lg md:text-2xl font-medium">
          <CalculatorIcon className="size-7" />
          <span>{t`app-title`}</span>
        </div>
        <div class="flex flex-wrap items-center justify-end gap-3.5 mt-1">
          <Menu
            anchor={({ toggle, open }) => (
              <button
                type="button"
                onClick={toggle}
                class="flex items-center gap-0.5 text-xs font-semibold cursor-pointer"
              >
                <span>{t('language', { lang: lang.toUpperCase() })}</span>
                <ChevronDownIcon
                  className={cn('size-4 transition-[rotate]', {
                    'rotate-180': open
                  })}
                />
              </button>
            )}
            class="dropdown-center"
          >
            <MenuButton
              onClick={() => i18n.changeLanguage('en')}
              class={cn({ 'menu-active': lang.startsWith('en') })}
            >{t`english`}</MenuButton>
            <MenuButton
              onClick={() => i18n.changeLanguage('es')}
              class={cn({ 'menu-active': lang.startsWith('es') })}
            >{t`spanish`}</MenuButton>
          </Menu>
          <Menu
            anchor={({ toggle, open }) => (
              <button
                type="button"
                onClick={toggle}
                class="flex items-center gap-0.5 text-xs font-semibold cursor-pointer"
              >
                {t`theme`}
                <ChevronDownIcon
                  className={cn('size-4 transition-[rotate]', {
                    'rotate-180': open
                  })}
                />
              </button>
            )}
            class="dropdown-end xl:dropdown-center"
          >
            {AVAIL_THEMES.map((option, i) => (
              <MenuButton
                key={i}
                onClick={() => setTheme(option)}
                class={cn({ 'menu-active': option == theme })}
              >
                {capitalize(option)}
              </MenuButton>
            ))}
          </Menu>
        </div>
      </div>
      <div class="grow overflow-auto bg-base-100 rounded-2xl rounded-b-none border-2 border-neutral/15 border-b-0">
        <CaloryApp />
      </div>
    </div>
  )
}

const AppProvider = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <DialogsProvider>
          <SettingsProvider>
            <StoreProvider>
              <App />
            </StoreProvider>
          </SettingsProvider>
        </DialogsProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default AppProvider
