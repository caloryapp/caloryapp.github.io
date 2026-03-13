import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import ThemeProvider from './providers/ThemeProvider'
import DialogsProvider from './providers/DialogsProvider'
import StoreProvider from './providers/StoreProvider'
import SettingsProvider from './providers/SettingsProvider'
import HomePage from './pages/HomePage'

const AppProvider = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <DialogsProvider>
          <SettingsProvider>
            <StoreProvider>
              <HomePage />
            </StoreProvider>
          </SettingsProvider>
        </DialogsProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default AppProvider
