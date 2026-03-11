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
  const [goal, setGoal] = useState(localStorage.getItem('goal') || '')

  const ctxValue = useMemo<SettingsContextProps>(
    () => ({
      goal: Number.parseFloat(goal),
      setGoal: (val) => {
        if (typeof val == 'function') {
          setGoal((goal) => {
            const x = val(Number.parseFloat(goal))
            return isNaN(x) ? '' : `${x}`
          })
        } else {
          setGoal(isNaN(val) ? '' : `${val}`)
        }
      }
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
