import './styles.css'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import DialogsProvider from './providers/DialogsProvider'
import StoreProvider from './providers/StoreProvider'
import Calculator from './components/Calculator'

const CaloryApp = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <DialogsProvider>
        <StoreProvider>
          <Calculator />
        </StoreProvider>
      </DialogsProvider>
    </I18nextProvider>
  )
}

export default CaloryApp
