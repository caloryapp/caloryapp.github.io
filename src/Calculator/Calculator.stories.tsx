import { Story, StoryDefault } from '@ladle/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import DialogsProvider from '../providers/DialogsProvider'
import StoreProvider from '../providers/StoreProvider'
import Calculator from './Calculator'

export default {
  title: 'Components'
} satisfies StoryDefault

export const Example: Story = () => {
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
Example.storyName = 'Calculator'
