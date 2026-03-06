import { useState } from 'preact/hooks'
import { Story, StoryDefault } from '@ladle/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import StoreProvider from '../../providers/StoreProvider'
import SettingsDialog from './SettingsDialog'

export default {
  title: 'Dialogs'
} satisfies StoryDefault

export const Example: Story = () => {
  const [open, setOpen] = useState(true)

  return (
    <I18nextProvider i18n={i18n}>
      <StoreProvider>
        <button onClick={() => setOpen(true)} class="btn">
          Open Settings Dialog
        </button>
        <SettingsDialog open={open} onClose={() => setOpen(false)} />
      </StoreProvider>
    </I18nextProvider>
  )
}
Example.storyName = 'SettingsDialog'
