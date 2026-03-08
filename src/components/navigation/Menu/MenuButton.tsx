import { ComponentChildren } from 'preact'
import { cn } from '../../../libs/tw'
import { useMenuContext } from './Menu.context'

export type MenuButtonProps = {
  onClick?: (e: Event & { currentTarget: HTMLButtonElement }) => void
  class?: string
  children: ComponentChildren
}

const MenuButton = ({
  onClick,
  class: className,
  children
}: MenuButtonProps) => {
  const { execCommand } = useMenuContext()

  return (
    <li>
      <button
        onClick={execCommand(onClick)}
        class={cn('whitespace-nowrap', className)}
      >
        {children}
      </button>
    </li>
  )
}

export default MenuButton
