import { useRef } from 'react'

export function useEnterSubmit() {
  const formRef = useRef<HTMLFormElement>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      formRef.current?.requestSubmit()
      e.preventDefault()
    }
  }

  return { formRef, onKeyDown: handleKeyDown }
}
