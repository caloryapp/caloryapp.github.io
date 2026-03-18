import { useTranslation } from 'react-i18next'
import CalculatorIcon from 'src/assets/icons/calculator.svg?react'
import ChevronDownIcon from 'src/assets/icons/chevron-down.svg?react'
import { AVAIL_THEMES } from 'src/config/theme'
import { capitalize } from 'src/libs/strings'
import { cn } from 'src/libs/tw'
import { useThemeContext } from 'src/providers/ThemeProvider'
import Menu, { MenuButton } from 'src/components/navigation/Menu'
import { LangMenu } from './LangMenu'
import Calculator from './Calculator'

const HomePage = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useThemeContext()

  return (
    <div class="flex flex-col h-screen w-[calc(100%-2rem)] max-w-6xl mx-auto">
      <div class="navbar z-20">
        <div class="grow flex items-center gap-1.5 text-lg md:text-2xl font-medium">
          <CalculatorIcon className="size-7" />
          <span>{t`homePage:app-title`}</span>
        </div>
        <div class="flex flex-wrap items-center justify-end gap-3.5 mt-1">
          <LangMenu />
          <Menu
            anchor={({ toggle, open }) => (
              <button
                type="button"
                onClick={toggle}
                class="flex items-center gap-0.5 text-xs font-semibold cursor-pointer"
              >
                {t`common:theme`}
                <ChevronDownIcon
                  className={cn('size-4 transition-[rotate]', {
                    'rotate-180': open
                  })}
                />
              </button>
            )}
            class="dropdown-end xl:dropdown-center"
          >
            {AVAIL_THEMES.map((option, i) => (
              <MenuButton
                key={i}
                onClick={() => setTheme(option)}
                class={cn({ 'menu-active': option == theme })}
              >
                {capitalize(option)}
              </MenuButton>
            ))}
          </Menu>
        </div>
      </div>
      <div class="grow overflow-auto bg-base-100 rounded-2xl rounded-b-none border-2 border-neutral/15 border-b-0">
        <Calculator />
      </div>
    </div>
  )
}

export default HomePage
