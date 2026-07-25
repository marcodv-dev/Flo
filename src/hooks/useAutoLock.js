import { useEffect } from 'react'

export function useAutoLock(lock) {
  useEffect(() => {
    const handle = () => {
      if (document.visibilityState === 'hidden' || document.hidden) lock()
    }
    const handleBlur = () => lock()
    document.addEventListener('visibilitychange', handle)
    window.addEventListener('blur', handleBlur)
    return () => {
      document.removeEventListener('visibilitychange', handle)
      window.removeEventListener('blur', handleBlur)
    }
  }, [lock])
}