import { useEffect, useRef, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import DocumentArrowDownIcon from '../assets/icons/document-arrow-down.svg?react'
import DocumentArrowUpIcon from '../assets/icons/document-arrow-up.svg?react'
import Cog6ToothIcon from '../assets/icons/cog-6-tooth.svg?react'
import RocketLaunchIcon from '../assets/icons/rocket-launch.svg?react'
import { cn } from '../libs/tw'
import { useCalculatorContext } from './Calculator.context'

const SettingsButton = () => {
  const { t } = useTranslation()
  const { importArticles, exportArticles, showSettingsDialog } =
    useCalculatorContext()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const onMenuAction = (action: () => void) => () => {
    action()
    setOpen(false)
  }

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
  }, [])

  return (
    <div
      ref={wrapperRef}
      class={cn('dropdown dropdown-end', { 'dropdown-open': open })}
    >
      <button
        type="button"
        ref={anchorRef}
        onClick={() => setOpen((val) => !val)}
        class="btn btn-square"
      >
        <Cog6ToothIcon />
      </button>
      {open && (
        <ul class="menu dropdown-content bg-base-100 border border-base-300 shadow-md/30 my-1.5 rounded-box">
          <li>
            <button type="button" onClick={onMenuAction(showSettingsDialog)}>
              <RocketLaunchIcon />
              <span class="text-nowrap">{t`goal-kcal`}</span>
            </button>
          </li>
          <li />
          <li>
            <button type="button" onClick={onMenuAction(importArticles)}>
              <DocumentArrowUpIcon />
              <span class="text-nowrap">{t`import-ingredients`}</span>
            </button>
          </li>
          <li>
            <button type="button" onClick={onMenuAction(exportArticles)}>
              <DocumentArrowDownIcon />
              <span class="text-nowrap">{t`export-ingredients`}</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}

export default SettingsButton
