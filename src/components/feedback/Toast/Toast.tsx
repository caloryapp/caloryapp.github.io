import {
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'preact/hooks'
import { forwardRef } from 'preact/compat'
import CloseIcon from 'src/assets/icons/close.svg?react'

export type ToastSeverity = 'info' | 'success'

export type ToastShowProps = {
  message: string
  severity?: ToastSeverity
  delay?: number
}

export type ToastHandle = {
  show: (props: ToastShowProps) => void
}

const alertClasses = {
  info: 'alert-info',
  success: 'alert-success'
}

const Toast = forwardRef<ToastHandle>((_, ref) => {
  const timeout = useRef<NodeJS.Timeout>()
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: ToastSeverity
  }>({
    open: false,
    message: '',
    severity: 'info'
  })

  const handleReset = useCallback(
    () =>
      setToast((val) => ({
        ...val,
        open: false,
        message: '',
        severity: 'info'
      })),
    []
  )

  const handleClose = useCallback(() => {
    if (!timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = undefined
    }
    handleReset()
  }, [handleReset])

  useImperativeHandle(
    ref,
    () => ({
      show: ({ message, severity = 'info', delay = 0 }) => {
        setToast((val) => ({ ...val, open: true, message, severity }))
        if (timeout.current) clearTimeout(timeout.current)
        if (delay > 0) {
          timeout.current = setTimeout(handleReset, delay)
        }
      }
    }),
    [handleReset]
  )

  if (!toast.open) return

  return (
    <div className="toast toast-center toast-bottom">
      <div className={`alert ${alertClasses[toast.severity]}`}>
        <div>{toast.message}</div>
        <button
          type="button"
          onClick={handleClose}
          class="btn btn-square btn-xs btn-link text-info-content"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>
    </div>
  )
})

export default Toast
