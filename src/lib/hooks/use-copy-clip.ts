import { useState } from 'react'

export function useCopyClip({ timeout = 2000 } = {}) {
  const [isCopied, setIsCopied] = useState(false)

  function copyClip(value: string) {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      return
    }

    if (!value) return

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    })
  }

  return { isCopied, copyClip }
}
