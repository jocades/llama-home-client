import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initValue: T) {
  const [storedValue, setStoredValue] = useState(initValue)

  useEffect(() => {
    const item = localStorage.getItem(key)
    if (item) setStoredValue(JSON.parse(item))
  }, [key])

  const setValue = (value: T) => {
    setStoredValue(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue] as const
}
