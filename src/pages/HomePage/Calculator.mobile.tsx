import { useTranslation } from 'react-i18next'

const CalculatorMobile = () => {
  const { t } = useTranslation()

  return (
    <div class="h-full flex justify-center pt-10 px-6 sm:items-center sm:pt-0 whitespace-break-spaces">
      <span class="text-lg text-center">{t`narrow-screen`}</span>
    </div>
  )
}

export default CalculatorMobile
