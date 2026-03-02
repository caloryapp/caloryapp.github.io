import { Story, StoryDefault } from '@ladle/react'
import InputField from './InputField'

export default {
  title: 'Components/Inputs'
} satisfies StoryDefault

export const Example: Story = () => {
  return <InputField type="text" label="Daily limit" placeholder="kcal" />
}
Example.storyName = 'InputField'
