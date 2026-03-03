import { useRef } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { CaloryApp } from '@caloryapp/calculator'
import CalculatorIcon from 'src/assets/icons/calculator.svg?react'
import { cn } from 'src/libs/tw'
import { capitalize } from 'src/libs/strings'
import { useTheme } from 'src/libs/theme'

const availThemes = ['light', 'cupcake', 'caramellatte', 'valentine']

const HomePage = () => {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  const handleChangeTheme = (theme: string) => {
    const detailsEl = detailsRef.current
    if (!detailsEl) return
    setTheme(theme)
    detailsEl.open = false
  }

  return (
    <div class="flex flex-col h-screen max-w-6xl mx-auto">
      <div class="navbar z-20">
        <div class="flex-1 flex items-center gap-1.5 text-2xl font-medium">
          <CalculatorIcon />
          <span>{t`app-title`}</span>
        </div>
        <div class="flex-none">
          <ul class="menu menu-horizontal px-1">
            <li>
              <details ref={detailsRef}>
                <summary>{t`theme`}</summary>
                <ul class="bg-base-100 rounded-t-none p-2">
                  {availThemes.map((option, i) => (
                    <li key={i}>
                      <a
                        class={cn({ 'font-semibold': theme == option })}
                        onClick={() => handleChangeTheme(option)}
                      >
                        {capitalize(option)}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
      <div class="grow overflow-auto bg-base-100 rounded-2xl rounded-b-none border-2 border-neutral/15 border-b-0">
        <CaloryApp />
      </div>
    </div>
  )
}

export default HomePage
