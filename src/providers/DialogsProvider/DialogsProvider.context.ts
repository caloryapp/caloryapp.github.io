import { ComponentChild, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { ToastSeverity } from '../../components/feedback/Toast/Toast'

export type DialogsContextProps = {
  toast: (props: { message: string; severity?: ToastSeverity }) => void
  confirm: (props: {
    header?: ComponentChild
    message: ComponentChild
    onAccept: () => void
  }) => void
}

export const DialogsContext = createContext<DialogsContextProps | null>(null)

export const useDialogsContext = () => {
  const ctx = useContext(DialogsContext)
  if (!ctx) {
    throw new Error('uninitialized context')
  }
  return ctx
}
