import { Story, StoryDefault } from '@ladle/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import DialogsProvider from '../../providers/DialogsProvider'
import SettingsProvider from '../../providers/SettingsProvider'
import StoreProvider from '../../providers/StoreProvider'
import Calculator from './Calculator'

export default {
  title: 'Components'
} satisfies StoryDefault

export const Example: Story = () => {
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
Example.storyName = 'Calculator'
