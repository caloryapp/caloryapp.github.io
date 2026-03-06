import { ComponentChild, ComponentChildren } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

export type DialogProps = {
  open?: boolean
  header?: ComponentChild
  actions?: ComponentChild
  children?: ComponentChildren
  onClose?: () => void
}

const Dialog = ({ open, header, actions, children, onClose }: DialogProps) => {
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
        {header && <h3 class="text-lg font-bold">{header}</h3>}
        {children && <div class="py-4">{children}</div>}
        {actions && <div class="modal-action">{actions}</div>}
      </div>
    </dialog>
  )
}

export default Dialog
