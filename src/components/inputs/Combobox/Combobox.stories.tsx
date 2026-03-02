import { useState } from 'preact/hooks'
import { Story, StoryDefault } from '@ladle/react'
import { faker } from '@faker-js/faker'
import Combobox from './Combobox'

export default {
  title: 'Components/Inputs'
} satisfies StoryDefault

export const Example: Story = () => {
  const [text, setText] = useState('')

  return (
    <Combobox
      autoFocus
      value={text}
      onChange={(e) => setText(e.currentTarget.value)}
      onSelectOption={(option) => setText(option.name)}
      renderOption={(option, select) => (
        <a onMouseDown={select}>{option.name}</a>
      )}
      options={options}
    />
  )
}
Example.storyName = 'Combobox'

const options = faker.helpers.multiple(
  () => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['kcalPer100g', 'kcalPerUnit'] as const),
    name: faker.commerce.productName(),
    kcal: faker.number.int({ min: 10, max: 900 }),
    total: faker.datatype.boolean(0.3)
      ? faker.number.int({ min: 1, max: 200 })
      : null
  }),
  { count: 50 }
)
