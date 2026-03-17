import { useEffect, useMemo, useState } from 'preact/hooks'
import { BREAKPOINTS } from 'src/config/theme'

export const useMediaQuery = (q: string) => {
  const mq = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return null
    return window.matchMedia(q)
  }, [q])
  const [changed, setChanged] = useState(!!mq?.matches)
  useEffect(() => {
    if (!mq) return
    const onMediaChange = (e: MediaQueryListEvent) => setChanged(e.matches)
    mq.addEventListener('change', onMediaChange)
    setChanged(mq.matches)
    return () => {
      mq.removeEventListener('change', onMediaChange)
    }
  }, [mq])
  return changed
}

export const useIsMobile = () => useMediaQuery(`(width < ${BREAKPOINTS.sm}px)`)
export const useIsSmallTablet = () =>
  useMediaQuery(`(width < ${BREAKPOINTS.md}px)`)
export const useIsTablet = () => useMediaQuery(`(width < ${BREAKPOINTS.lg}px)`)
