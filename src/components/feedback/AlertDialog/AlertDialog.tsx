import { ComponentChild } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

export type AlertDialogProps = {
  open: boolean
  header: ComponentChild
  message: ComponentChild
  actions: ComponentChild
  onClose?: () => void
}

const AlertDialog = ({
  open,
  header,
  message,
  actions,
  onClose
}: AlertDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleBackdropClick = (event: MouseEvent) => {
    if (onClose && event.target === event.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    const dialogEl = dialogRef.current
    if (!dialogEl) return

    if (open && !dialogEl.open) dialogEl.showModal()
    if (!open && dialogEl.open) dialogEl.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={onClose}
      class="modal"
    >
      <div class="modal-box">
        <h3 class="text-lg font-bold">{header}</h3>
        <p class="py-4">{message}</p>
        <div class="modal-action">{actions}</div>
      </div>
    </dialog>
  )
}

export default AlertDialog
