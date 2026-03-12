import { useEffect, useMemo, useState } from 'preact/hooks'
import { BREAKPOINTS } from '../config/theme'

export const useMediaQuery = (q: string) => {
  const mq = useMemo(() => window.matchMedia(q), [q])
  const [changed, setChanged] = useState(mq.matches)
  useEffect(() => {
    const onMediaChange = (e: MediaQueryListEvent) => setChanged(e.matches)
    mq.addEventListener('change', onMediaChange)
    setChanged(mq.matches)
    return () => {
      mq.removeEventListener('change', onMediaChange)
    }
  }, [mq])
  return changed
}

export const useIsSmallScreen = () =>
  useMediaQuery(`(width < ${BREAKPOINTS.lg}px)`)
