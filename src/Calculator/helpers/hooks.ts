import { useEffect, useMemo, useRef } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import Sortable, { SortableEvent } from 'sortablejs'

export type SortableProps = {
  draggable: string
  handle: string
  onEnd?: (event: SortableEvent) => void
}

export const useSortable = <T extends HTMLElement>({
  draggable,
  handle,
  onEnd
}: SortableProps) => {
  const ref = useRef<T>(null)
  const onEndRef = useRef(onEnd)

  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  useEffect(() => {
    const elem = ref.current
    if (!elem) return

    const sortable = new Sortable(elem, {
      draggable,
      handle,
      onEnd: (event) => onEndRef.current?.(event)
    })

    return () => {
      sortable.destroy()
    }
  }, [draggable, handle])

  return { ref }
}

export const useCurrentDate = () => {
  const { i18n } = useTranslation()

  return useMemo(
    () =>
      new Date().toLocaleDateString(i18n.resolvedLanguage, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
    [i18n.resolvedLanguage]
  )
}
