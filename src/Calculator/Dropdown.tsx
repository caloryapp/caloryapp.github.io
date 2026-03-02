import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import ChevronUpDownIcon from '../../assets/icons/chevron-up-down.svg?react'
import MinusIcon from '../../assets/icons/trash.svg?react'
import { cn } from '../libs/tw'
import { truncateText } from './helpers'

const maxOptionCols = 40
const maxDropdownHeight = 384

export type DropdownOption = {
  id: string
  name: string
}

export type DropdownProps = {
  options: DropdownOption[]
  onSelectOption: (id: string) => void
  onDeleteOption?: (id: string) => void
}

const Dropdown = ({
  options,
  onSelectOption,
  onDeleteOption
}: DropdownProps) => {
  const { t } = useTranslation()
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const dropdownRef = useRef<HTMLUListElement>(null)
  const [dropUp, setDropUp] = useState(false)

  const closePopup = () => {
    const detailsElem = detailsRef.current
    if (!detailsElem) return

    detailsElem.open = false
    const list = detailsElem.getElementsByTagName('ul')[0]
    list?.scrollTo({ top: 0 })
  }

  const updateDropdownDirection = useCallback(() => {
    const detailsElem = detailsRef.current
    const dropdownElem = dropdownRef.current
    if (!detailsElem || !dropdownElem) return

    const summaryElem = detailsElem.querySelector('summary')
    if (!summaryElem) return

    const summaryRect = summaryElem.getBoundingClientRect()
    const topSpace = summaryRect.top
    const bottomSpace = window.innerHeight - summaryRect.bottom
    const dropdownHeight = Math.min(
      dropdownElem.scrollHeight,
      maxDropdownHeight
    )

    setDropUp(bottomSpace < dropdownHeight && topSpace > bottomSpace)
  }, [])

  const handleSelectOption = (id: string) => {
    closePopup()
    onSelectOption(id)
  }

  useEffect(() => {
    const detailsElem = detailsRef.current
    if (!detailsElem) return

    const handleToggle = () => {
      if (detailsElem.open) {
        updateDropdownDirection()
      }
    }

    const handleViewportChange = () => {
      if (detailsElem.open) {
        updateDropdownDirection()
      }
    }

    detailsElem.addEventListener('toggle', handleToggle)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      detailsElem.removeEventListener('toggle', handleToggle)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [updateDropdownDirection])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const detailsElem = detailsRef.current
      if (!detailsElem?.open) return
      const targetNode = event.target as Node | null
      if (targetNode && !detailsElem.contains(targetNode)) {
        closePopup()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <details
      ref={detailsRef}
      class={cn('dropdown', { 'dropdown-top': dropUp })}
    >
      <summary class="btn btn-square">
        <ChevronUpDownIcon />
      </summary>
      <ul
        ref={dropdownRef}
        class="menu dropdown-content bg-base-100 border border-base-300 shadow-md/30 mt-1.5 rounded-2xl flex-nowrap overflow-y-auto"
        style={{ maxHeight: maxDropdownHeight }}
      >
        {!options.length && <li class="whitespace-pre">{t`no-options`}</li>}
        {options.map((option) => (
          <li
            key={option.id}
            class="flex flex-row flex-nowrap items-center gap-1"
          >
            <button
              type="button"
              onMouseDown={() => handleSelectOption(option.id)}
              class="grow"
            >
              <span class="whitespace-nowrap">
                {truncateText(option.name, maxOptionCols)}
              </span>
            </button>
            {onDeleteOption && (
              <button
                type="button"
                onClick={() => onDeleteOption(option.id)}
                class="btn btn-ghost btn-square btn-sm"
              >
                <MinusIcon aria-label="delete" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </details>
  )
}

export default Dropdown
