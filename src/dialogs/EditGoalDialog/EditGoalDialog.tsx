import { useCallback, useEffect, useId, useRef, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { useStoreContext } from '../../providers/StoreProvider'
import Dialog from '../../components/feedback/Dialog'

export type EditGoalDialogProps = {
  open: boolean
  onClose: () => void
}

const EditGoalDialog = ({ open, onClose }: EditGoalDialogProps) => {
  const { t } = useTranslation()
  const { preferences, updatePreferences } = useStoreContext()
  const [goal, setGoal] = useState('')
  const formId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSave = useCallback(() => {
    updatePreferences({ goal: Number.parseFloat(goal) })
    onClose()
  }, [goal, onClose, updatePreferences])

  const handleInput = (e: Event & { currentTarget: HTMLInputElement }) => {
    setGoal(e.currentTarget.value)
  }

  const goalValue = Number.isNaN(preferences.goal) ? '' : `${preferences.goal}`
  useEffect(() => {
    setGoal(goalValue)
  }, [goalValue])

  useEffect(() => {
    const inputEl = inputRef.current
    if (!open || !inputEl) return
    inputEl.select()
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      actions={
        <>
          <button type="button" onClick={onClose} class="btn">
            {t`cancel`}
          </button>
          <button type="submit" form={formId} class="btn btn-primary">
            {t`save`}
          </button>
        </>
      }
    >
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault()
          handleSave()
        }}
      >
        <label class="floating-label">
          <span>{t`caloric-goal`}</span>
          <input
            ref={inputRef}
            type="number"
            autoFocus
            placeholder={t`caloric-goal`}
            value={goal}
            onInput={handleInput}
            class="input w-full"
          />
        </label>
      </form>
    </Dialog>
  )
}

export default EditGoalDialog
