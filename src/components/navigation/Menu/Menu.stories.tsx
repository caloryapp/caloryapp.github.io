import { Story, StoryDefault } from '@ladle/react'
import Cog6ToothIcon from '../../../assets/icons/cog-6-tooth.svg?react'
import RocketLaunchIcon from '../../../assets/icons/rocket-launch.svg?react'
import Menu from './Menu'
import MenuButton from './MenuButton'
import MenuDivider from './MenuDivider'

export default {
  title: 'Components/Navigation'
} satisfies StoryDefault

export const Example: Story = () => {
  return (
    <Menu
      anchor={({ toggle, open }) => (
        <button class="btn" onClick={toggle}>
          {open ? 'Close menu' : 'Open menu'}
        </button>
      )}
    >
      <MenuButton onClick={() => console.info('Settings')}>
        <Cog6ToothIcon className="size-5" />
        Settings
      </MenuButton>
      <MenuButton onClick={() => console.info('Goal')}>
        <RocketLaunchIcon className="size-5" />
        Goal
      </MenuButton>
      <MenuDivider />
      <MenuButton onClick={() => console.info('Import')}>Import</MenuButton>
      <MenuButton onClick={() => console.info('Export')}>Export</MenuButton>
    </Menu>
  )
}
Example.storyName = 'Menu'
