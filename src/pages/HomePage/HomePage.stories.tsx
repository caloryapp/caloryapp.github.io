import { Story, StoryDefault } from '@ladle/react'
import { I18nextProvider } from 'react-i18next'
import i18n from 'src/i18n'
import ThemeProvider from 'src/providers/ThemeProvider'
import DialogsProvider from 'src/providers/DialogsProvider'
import SettingsProvider from 'src/providers/SettingsProvider'
import StoreProvider from 'src/providers/StoreProvider'
import HomePage from './HomePage'

export default {
  title: 'Pages'
} satisfies StoryDefault

export const Example: Story = () => {
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
Example.storyName = 'HomePage'
