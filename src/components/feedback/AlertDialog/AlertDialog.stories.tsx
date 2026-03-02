import type { Story, StoryDefault } from '@ladle/react'
import DialogsProvider, {
  useDialogsContext
} from '../../../providers/DialogsProvider'

export default {
  title: 'Components/Feedback',
  decorators: [
    (Component) => (
      <DialogsProvider>
        <Component />
      </DialogsProvider>
    )
  ]
} satisfies StoryDefault

export const Example: Story = () => {
  const { confirm } = useDialogsContext()
  return (
    <button
      type="button"
      onClick={() =>
        confirm({
          header: 'Confirm',
          message: 'Please accept to continue.',
          onAccept: () => console.info('done!')
        })
      }
      class="btn"
    >
      Open Confirm Dialog
    </button>
  )
}
Example.storyName = 'AlertDialog'
