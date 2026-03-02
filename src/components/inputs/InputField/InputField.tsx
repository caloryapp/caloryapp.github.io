import { InputHTMLAttributes } from 'preact'
import { useId } from 'preact/hooks'
import { cn } from '../../../libs/tw'

export type InputFieldProps = InputHTMLAttributes & {
  label?: string
}

const InputField = ({ label, class: className, ...rest }: InputFieldProps) => {
  const id = useId()

  return (
    <div class={cn('flex flex-col gap-2', { contents: !label })}>
      {label && (
        <label htmlFor={id} class="label">
          {label}
        </label>
      )}
      <input
        id={id}
        {...rest}
        class={cn('input', className, { 'w-full': !!label })}
      />
    </div>
  )
}

export default InputField
