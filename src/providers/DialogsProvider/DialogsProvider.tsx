import { ComponentChild, ComponentChildren } from 'preact'
import { useMemo, useRef, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import Dialog from 'src/components/feedback/Dialog'
import Toast, { ToastHandle } from 'src/components/feedback/Toast'
import { DialogsContext, DialogsContextProps } from './DialogsProvider.context'

type DialogsProviderProps = {
  children: ComponentChildren
}

const DialogsProvider = ({ children }: DialogsProviderProps) => {
  const { t } = useTranslation()
  const toastRef = useRef<ToastHandle>(null)
  const [dialog, setDialog] = useState<{
    open: boolean
    body: ComponentChild
    actions?: (close: () => void) => ComponentChildren
  }>({
    open: false,
    body: null
  })

  const ctxValue = useMemo<DialogsContextProps>(
    () => ({
      toast: (props) => {
        toastRef.current?.show(props)
      },
      dialog: (props) => setDialog({ open: true, ...props }),
      confirm: (props) => {
        setDialog({
          open: true,
          body: props.body,
          actions: (close) => (
            <>
              <button type="button" onClick={close} class="btn">
                {t`common:cancel`}
              </button>
              <button
                autoFocus
                type="button"
                onClick={() => {
                  props.onAccept()
                  close()
                }}
                class="btn btn-primary"
              >
                {t`common:accept`}
              </button>
            </>
          )
        })
      }
    }),
    [t]
  )

  return (
    <DialogsContext value={ctxValue}>
      {children}
      <Toast ref={toastRef} />
      <Dialog
        open={dialog.open}
        actions={dialog.actions?.(() =>
          setDialog((val) => ({ ...val, open: false }))
        )}
      >
        {dialog.body}
      </Dialog>
    </DialogsContext>
  )
}

export default DialogsProvider
