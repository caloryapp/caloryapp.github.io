import { useEffect, useMemo, useState } from 'preact/hooks'
import {
  SettingsContext,
  SettingsContextProps
} from './SettingsProvider.context'
import { ComponentChildren } from 'preact'

type SettingsProviderProps = {
  children: ComponentChildren
}

const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [goal, setGoal] = useState(
    Number.parseFloat(localStorage.getItem('goal') || '')
  )

  const ctxValue = useMemo<SettingsContextProps>(
    () => ({
      goal,
      setGoal
    }),
    [goal]
  )

  useEffect(() => {
    if (goal) {
      localStorage.setItem('goal', Number.isNaN(goal) ? '' : `${goal}`)
    } else {
      localStorage.removeItem('goal')
    }
  }, [goal])

  return <SettingsContext value={ctxValue}>{children}</SettingsContext>
}

export default SettingsProvider
