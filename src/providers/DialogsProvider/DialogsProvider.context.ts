import { ComponentChild, ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { ToastSeverity } from 'src/components/feedback/Toast'

export type DialogsContextProps = {
  toast: (props: { message: string; severity?: ToastSeverity }) => void
  dialog: (props: {
    body: ComponentChild
    actions?: (close: () => void) => ComponentChildren
  }) => void
  confirm: (props: { body: ComponentChild; onAccept: () => void }) => void
}

export const DialogsContext = createContext<DialogsContextProps | null>(null)

export const useDialogsContext = () => {
  const ctx = useContext(DialogsContext)
  if (!ctx) {
    throw new Error('uninitialized context')
  }
  return ctx
}
