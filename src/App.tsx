import { useTranslation } from 'react-i18next'
import CalculatorIcon from './assets/icons/calculator.svg?react'
import ChevronDownIcon from './assets/icons/chevron-down.svg?react'
import { capitalize } from './libs/strings'
import { cn } from './libs/tw'
import { useTheme } from './libs/theme'
import Menu, { MenuButton } from './components/navigation/Menu'
import CaloryApp from './CaloryApp'

const availThemes = ['light', 'cupcake', 'caramellatte', 'valentine']

const App = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  const handleChangeTheme = (theme: string) => {
    setTheme(theme)
  }

  return (
    <div class="flex flex-col h-screen max-w-6xl mx-auto">
      <div class="navbar z-20">
        <div class="flex-1 flex items-center gap-1.5 text-2xl font-medium">
          <CalculatorIcon className="size-7" />
          <span>{t`app-title`}</span>
        </div>
        <Menu
          anchor={({ toggle, open }) => (
            <button type="button" onClick={toggle} class="btn btn-sm btn-ghost">
              {t`theme`}
              <ChevronDownIcon
                className={cn('size-4 transition-[rotate]', {
                  'rotate-180': open
                })}
              />
            </button>
          )}
          class="flex-none dropdown-center self-end"
        >
          {availThemes.map((option, i) => (
            <MenuButton
              key={i}
              onClick={() => handleChangeTheme(option)}
              class={cn({ 'menu-active': option == theme })}
            >
              {capitalize(option)}
            </MenuButton>
          ))}
        </Menu>
      </div>
      <div class="grow overflow-auto bg-base-100 rounded-2xl rounded-b-none border-2 border-neutral/15 border-b-0">
        <CaloryApp />
      </div>
    </div>
  )
}

export default App
