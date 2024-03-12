import { useEffect } from 'react'

interface MutationObserverParams {
  ref: React.MutableRefObject<HTMLElement | null>
  callback: MutationCallback
  options?: MutationObserverInit
}

const useMutationObserver = ({
  ref,
  callback,
  options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  },
}: MutationObserverParams) => {
  useEffect(() => {
    if (!ref.current) return

    const observer = new MutationObserver(callback)
    observer.observe(ref.current, options)

    return () => observer.disconnect()
  }, [ref, callback, options])
}

export default useMutationObserver
