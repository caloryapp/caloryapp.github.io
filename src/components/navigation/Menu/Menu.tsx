import { ComponentChild, ComponentChildren } from 'preact'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { cn } from 'src/libs/tw'
import { MenuContext, MenuContextProps, useMenuContext } from './Menu.context'

export type MenuProps = {
  anchor: (params: { toggle: () => void; open: boolean }) => ComponentChild
  class?: string
  children?: ComponentChildren
}

const Menu = ({ anchor, class: className, children }: MenuProps) => {
  const { open, setOpen } = useMenuContext()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const handleToggleMenu = () => setOpen((val) => !val)

  useEffect(() => {
    const closeIfOutside = (target: EventTarget | null) => {
      const wrapperEl = wrapperRef.current
      if (!wrapperEl) return
      if (!wrapperEl.contains(target as Node | null)) {
        setOpen(false)
      }
    }

    const onMouseDown = (e: MouseEvent) => closeIfOutside(e.target)
    const onFocusIn = (e: FocusEvent) => closeIfOutside(e.target)
    const onWindowBlur = () => setOpen(false)

    window.addEventListener('mousedown', onMouseDown)
    document.addEventListener('focusin', onFocusIn)
    window.addEventListener('blur', onWindowBlur)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('focusin', onFocusIn)
      window.removeEventListener('blur', onWindowBlur)
    }
  }, [setOpen])

  return (
    <div
      ref={wrapperRef}
      class={cn('dropdown', className, { 'dropdown-open': open })}
    >
      {anchor({ toggle: handleToggleMenu, open })}
      {open && children && (
        <ul class="menu dropdown-content bg-base-100 border border-base-300 shadow-md/30 my-1.5 rounded-box">
          {children}
        </ul>
      )}
    </div>
  )
}

const MenuProvider = (props: MenuProps) => {
  const [open, setOpen] = useState(false)

  const ctxValue = useMemo<MenuContextProps>(
    () => ({
      open,
      setOpen,
      execCommand: (fn) => {
        return (e) => {
          fn?.(e)
          setOpen(false)
        }
      }
    }),
    [open]
  )

  return (
    <MenuContext value={ctxValue}>
      <Menu {...props} />
    </MenuContext>
  )
}

export default MenuProvider
