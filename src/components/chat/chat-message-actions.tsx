'use client'

import { Button } from '@/components/ui/button'
import { IconCheck, IconCopy } from '@/components/ui/icons'
import { useCopyClip } from '@/lib/hooks/use-copy-clip'
import { cn } from '@/lib/utils'
import { Message } from '@/lib/hooks/use-chat'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyClip } = useCopyClip()

  const onCopy = () => {
    if (isCopied) return
    copyClip(message.content)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0',
        className,
      )}
      {...props}
    >
      <Button variant='ghost' size='icon' onClick={onCopy}>
        {isCopied ? <IconCheck /> : <IconCopy />}
        <span className='sr-only'>Copy message</span>
      </Button>
    </div>
  )
}
