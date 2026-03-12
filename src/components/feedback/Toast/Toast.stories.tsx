import { Story, StoryDefault } from '@ladle/react'
import Toast, { ToastHandle } from './Toast'
import { useRef } from 'preact/hooks'

export default {
  title: 'Components/Feedback'
} satisfies StoryDefault

export const Example: Story = () => {
  const toastRef = useRef<ToastHandle>(null)

  return (
    <>
      <button
        type="button"
        onClick={() =>
          toastRef.current?.show({ message: 'Message 1', delay: 1000 })
        }
        class="btn"
      >
        Toast 1
      </button>
      <button
        type="button"
        onClick={() =>
          toastRef.current?.show({ message: 'Message 2', severity: 'success' })
        }
        class="btn"
      >
        Toast 2
      </button>
      <Toast ref={toastRef} />
    </>
  )
}
Example.storyName = 'Toast'
