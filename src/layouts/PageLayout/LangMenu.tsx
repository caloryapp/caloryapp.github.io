import { ComponentType } from 'preact'
import { SVGProps } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { cn } from 'src/libs/tw'
import BrFlagIcon from 'src/assets/flags/br.svg?react'
import DeFlagIcon from 'src/assets/flags/de.svg?react'
import EsFlagIcon from 'src/assets/flags/es.svg?react'
import FrFlagIcon from 'src/assets/flags/fr.svg?react'
import GbFlagIcon from 'src/assets/flags/gb.svg?react'
import ItFlagIcon from 'src/assets/flags/it.svg?react'
import PtFlagIcon from 'src/assets/flags/pt.svg?react'
import ChevronDownIcon from 'src/assets/icons/chevron-down.svg?react'
import Menu, { MenuButton } from 'src/components/navigation/Menu'

type FlagSvgComponent = ComponentType<SVGProps<SVGSVGElement>>

const availLangs: {
  code: string
  i18nKey: string
  FlagIcon: FlagSvgComponent
}[] = [
  { code: 'en', i18nKey: 'common:english', FlagIcon: GbFlagIcon },
  { code: 'es', i18nKey: 'common:spanish', FlagIcon: EsFlagIcon },
  { code: 'fr', i18nKey: 'common:french', FlagIcon: FrFlagIcon },
  { code: 'de', i18nKey: 'common:german', FlagIcon: DeFlagIcon },
  { code: 'pt', i18nKey: 'common:portuguese', FlagIcon: PtFlagIcon },
  { code: 'pt-BR', i18nKey: 'common:portuguese-brazil', FlagIcon: BrFlagIcon },
  { code: 'it', i18nKey: 'common:italian', FlagIcon: ItFlagIcon }
]

export const LangMenu = () => {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || i18n.language || 'en').toLowerCase()

  return (
    <Menu
      anchor={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          class="flex items-center gap-0.5 text-xs font-semibold cursor-pointer"
        >
          <span>{t('homePage:language', { lang: lang.toUpperCase() })}</span>
          <ChevronDownIcon
            className={cn('size-4 transition-[rotate]', {
              'rotate-180': open
            })}
          />
        </button>
      )}
      class="dropdown-center"
    >
      {availLangs.map(({ code, i18nKey, FlagIcon }) => (
        <MenuButton
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          class={cn({ 'menu-active': lang == code.toLowerCase() })}
        >
          <FlagIcon className="w-4 h-4 rounded-full ring-1 ring-base-content" />
          {t(i18nKey)}
        </MenuButton>
      ))}
    </Menu>
  )
}
