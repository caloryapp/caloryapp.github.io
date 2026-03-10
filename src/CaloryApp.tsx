import './styles.css'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import DialogsProvider from './providers/DialogsProvider'
import StoreProvider from './providers/StoreProvider'
import SettingsProvider from './providers/SettingsProvider'
import Calculator from './components/Calculator'

const CaloryApp = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <DialogsProvider>
        <SettingsProvider>
          <StoreProvider>
            <Calculator />
          </StoreProvider>
        </SettingsProvider>
      </DialogsProvider>
    </I18nextProvider>
  )
}

export default CaloryApp
