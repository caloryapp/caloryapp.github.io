import { useEffect, useMemo, useRef, useState } from 'preact/hooks'

/**
 * Hook that detects when a sticky element (like a table header) is "stuck"
 * to the viewport during scroll.
 *
 * Uses IntersectionObserver with an invisible sentinel element to detect
 * when the header is no longer visible at the top of the viewport.
 */
const useStickyDetection = () => {
  const [isStuck, setIsStuck] = useState(false)
  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    const table = tableRef.current
    if (!table) return

    // Create an invisible sentinel element at the top
    const sentinel = document.createElement('div')
    sentinel.style.cssText =
      'position:absolute;top:0;left:0;right:0;height:1px;pointer-events:none;'
    table.style.position = 'relative'
    table.prepend(sentinel)

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [])

  return useMemo(
    () => ({
      tableRef,
      isStuck
    }),
    [isStuck]
  )
}

export default useStickyDetection
