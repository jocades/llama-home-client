'use client'

import { Button } from '@/components/ui/button'
import { useSignal } from '@preact/signals-react'

interface TestPageProps {}

export default function TestPage(props: TestPageProps) {
  const signal = useSignal(0)

  return (
    <div>
      <Button
        onClick={() => signal.value = signal.value + 1}
      >
        {signal.value}
      </Button>
    </div>
  )
}
