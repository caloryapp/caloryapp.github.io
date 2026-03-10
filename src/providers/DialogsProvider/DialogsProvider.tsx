import { ComponentChild, ComponentChildren } from 'preact'
import { useMemo, useRef, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import Dialog from '../../components/feedback/Dialog'
import Toast, { ToastHandle } from '../../components/feedback/Toast'
import { DialogsContext, DialogsContextProps } from './DialogsProvider.context'

type DialogsProviderProps = {
  children: ComponentChildren
}

const DialogsProvider = ({ children }: DialogsProviderProps) => {
  const { t } = useTranslation()
  const toastRef = useRef<ToastHandle>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    header: ComponentChild
    message: ComponentChild
    onAccept: () => void
  }>({
    open: false,
    header: '',
    message: '',
    onAccept: () => {}
  })

  const ctxValue = useMemo<DialogsContextProps>(
    () => ({
      toast: (props) => {
        toastRef.current?.show(props)
      },
      confirm: (props) => {
        setConfirmDialog({
          open: true,
          header: props.header ?? t`confirm`,
          message: props.message,
          onAccept: props.onAccept
        })
      }
    }),
    [t]
  )

  const handleCloseConfirmDialog = () =>
    setConfirmDialog((val) => ({ ...val, open: false }))

  const handleAcceptConfirmDialog = () => {
    handleCloseConfirmDialog()
    confirmDialog.onAccept()
  }

  return (
    <DialogsContext value={ctxValue}>
      {children}
      <Toast ref={toastRef} />
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        header={confirmDialog.header}
        actions={
          <>
            <button
              type="button"
              onClick={handleCloseConfirmDialog}
              class="btn"
            >
              {t`cancel`}
            </button>
            <button
              autoFocus
              type="button"
              onClick={handleAcceptConfirmDialog}
              class="btn btn-primary"
            >
              {t`accept`}
            </button>
          </>
        }
      >
        {confirmDialog.message}
      </Dialog>
    </DialogsContext>
  )
}

export default DialogsProvider
