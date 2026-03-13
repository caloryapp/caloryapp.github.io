import { ComponentChild, InputHTMLAttributes } from 'preact'
import { forwardRef } from 'preact/compat'
import { useEffect, useLayoutEffect, useRef } from 'preact/hooks'
import ChevronDownIcon from 'src/assets/icons/chevron-down.svg?react'
import { cn } from 'src/libs/tw'
import { normalizeText } from './helpers'
import useMenuManager from './useMenuManager'

export type ComboboxOption = {
  id: string
  name: string
}

export type ComboboxProps = Omit<
  InputHTMLAttributes,
  'type' | 'ref' | 'onKeyDown'
> & {
  onSelectOption: (option: ComboboxOption) => void
  options: ComboboxOption[]
  renderOption: (
    option: ComboboxOption,
    onMouseDown: (e: MouseEvent) => void
  ) => ComponentChild
}

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      value,
      onChange,
      onSelectOption,
      options,
      renderOption,
      class: className,
      ...inputProps
    }: ComboboxProps,
    ref
  ) => {
    const [menu, dispatch] = useMenuManager()
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const inputWrapperRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const itemRefs = useRef<(HTMLLIElement | null)[]>([])

    const filteredOptions = menu.query
      ? options.filter((option) =>
          normalizeText(option.name).includes(
            normalizeText(`${menu.query}`.trim())
          )
        )
      : options

    const handleContainerBlur = (e: FocusEvent) => {
      const containerEl = containerRef.current
      const relatedTarget = e.relatedTarget as Node | null
      if (!containerEl || !relatedTarget) return
      if (relatedTarget && !containerEl.contains(relatedTarget)) {
        dispatch({ type: 'close' })
      }
    }

    const handleInputKeyDown = (e: KeyboardEvent) => {
      const query = `${value ?? ''}`
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          dispatch({ type: 'open', activeIndex: 0, query })
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          dispatch({
            type: 'open',
            activeIndex: filteredOptions.length - 1,
            query
          })
          break
        }
        case 'Escape': {
          e.preventDefault()
          dispatch({ type: 'close' })
          break
        }
      }
    }

    const handleInputChange = (
      e: Event & { currentTarget: HTMLInputElement }
    ) => {
      dispatch({ type: 'open', query: e.currentTarget.value })
      onChange?.(e)
    }

    const handleToggleMouseDown = (e: Event) => {
      e.preventDefault()
      dispatch({ type: 'toggle' })
    }

    const handleItemKeyDown = (e: KeyboardEvent, index: number) => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          dispatch({ type: 'next', size: filteredOptions.length })
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          dispatch({ type: 'back' })
          break
        }
        case 'Tab': {
          onSelectOption(filteredOptions[index])
          dispatch({ type: 'close' })
          break
        }
        case 'Enter': {
          e.preventDefault()
          onSelectOption(filteredOptions[index])
          dispatch({ type: 'close' })
          inputRef.current?.focus()
          break
        }
        case 'Escape': {
          e.preventDefault()
          dispatch({ type: 'close' })
          inputRef.current?.focus()
          break
        }
      }
    }

    const handleItemMouseDown = (e: MouseEvent, option: ComboboxOption) => {
      if (e.button !== 0) return
      e.preventDefault()
      dispatch({ type: 'close' })
      onSelectOption(option)
    }

    useLayoutEffect(() => {
      if (!menu.open) return

      const containerEl = containerRef.current
      const inputWrapperEl = inputWrapperRef.current
      const listEl = listRef.current
      if (!containerEl || !inputWrapperEl || !listEl) return

      const updatePosition = () => {
        const containerRect = containerEl.getBoundingClientRect()
        const inputRect = inputWrapperEl.getBoundingClientRect()
        const listRect = listEl.getBoundingClientRect()
        const spaceBelow = window.innerHeight - inputRect.bottom
        const relativeLeft = inputRect.left - containerRect.left
        const relativeTop = inputRect.top - containerRect.top

        listEl.style.minWidth = `${inputRect.width}px`
        listEl.style.left = `${relativeLeft}px`

        if (spaceBelow >= listRect.height) {
          listEl.style.top = `${relativeTop + inputRect.height}px`
          listEl.style.bottom = 'auto'
        } else {
          listEl.style.bottom = `${containerRect.height - relativeTop}px`
          listEl.style.top = 'auto'
        }
      }

      updatePosition()
      const resizeObserver = new ResizeObserver(updatePosition)
      resizeObserver.observe(inputWrapperEl)

      window.addEventListener('resize', updatePosition)
      return () => {
        resizeObserver.disconnect()
        window.removeEventListener('resize', updatePosition)
      }
    }, [menu.open, filteredOptions.length])

    // manages focus
    useEffect(() => {
      if (menu.open && menu.activeIndex < 0) {
        inputRef.current?.focus()
      } else {
        itemRefs.current[menu.activeIndex]?.focus()
      }
    }, [menu.open, menu.activeIndex])

    // closes the dropdown when the user clicks outside
    useEffect(() => {
      const onMouseDown = (e: MouseEvent) => {
        const containerEl = containerRef.current
        if (!containerEl) return
        const target = e.target as Node | null
        if (containerEl === target || !containerEl.contains(target)) {
          dispatch({ type: 'close' })
        }
      }

      window.addEventListener('mousedown', onMouseDown)
      return () => {
        window.removeEventListener('mousedown', onMouseDown)
      }
    }, [dispatch])

    return (
      <div
        ref={containerRef}
        onBlur={handleContainerBlur}
        class={cn('inline-block relative', className)}
      >
        <div
          ref={inputWrapperRef}
          className={cn(
            'join w-full',
            'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--color-base-content)'
          )}
          style={{ borderRadius: 'var(--radius-field)' }}
        >
          <input
            {...inputProps}
            ref={(e) => {
              inputRef.current = e

              if (typeof ref == 'function') {
                ref(e)
              } else if (ref) {
                ref.current = e
              }
            }}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            class={cn(
              'input w-full join-item focus:outline-none focus-within:outline-none',
              className
            )}
          />
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={handleToggleMouseDown}
            class="join-item btn btn-square focus:outline-none"
          >
            <ChevronDownIcon className="size-4" />
          </button>
        </div>
        {menu.open && filteredOptions.length > 0 && (
          <ul
            ref={listRef}
            class="absolute z-10 menu bg-base-100 border border-base-300 shadow-md/30 my-1.5 rounded-box flex-nowrap overflow-y-auto max-h-[40vh]"
          >
            {filteredOptions.map((option, index) => (
              <li
                key={option.id}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                tabIndex={-1}
                onKeyDown={(e) => handleItemKeyDown(e, index)}
              >
                {renderOption(option, (e: MouseEvent) =>
                  handleItemMouseDown(e, option)
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)

export default Combobox
