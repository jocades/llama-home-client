'use client'

import * as React from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { toast } from 'react-hot-toast'

import { type Chat, ServerActionResult } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { IconSpinner } from '@/components/ui/icons'
import { useCopyClip } from '@/lib/hooks/use-copy-clip'

interface ChatShareDialogProps extends DialogProps {
  chat: Pick<Chat, 'id' | 'title' | 'messages'>
  shareChat: (id: string) => ServerActionResult<Chat>
  onCopy: () => void
}

export function ChatShareDialog({
  chat,
  shareChat,
  onCopy,
  ...props
}: ChatShareDialogProps) {
  const { copyClip } = useCopyClip()
  const [isSharePending, startShareTransition] = React.useTransition()

  const copyShareLink = React.useCallback(
    async (chat: Chat) => {
      if (!chat.sharePath) {
        return toast.error('Could not copy share link to clipboard')
      }

      const url = new URL(window.location.href)
      url.pathname = chat.sharePath
      copyClip(url.toString())
      onCopy()
      toast.success('Share link copied to clipboard', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          fontSize: '14px',
        },
        iconTheme: {
          primary: 'white',
          secondary: 'black',
        },
      })
    },
    [copyClip, onCopy],
  )

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share link to chat</DialogTitle>
          <DialogDescription>
            Anyone with the URL will be able to view the shared chat.
          </DialogDescription>
        </DialogHeader>
        <div className='p-4 space-y-1 text-sm border rounded-md'>
          <div className='font-medium'>{chat.title}</div>
          <div className='text-muted-foreground'>
            {chat.messages?.length} messages
          </div>
        </div>
        <DialogFooter className='items-center'>
          <Button
            disabled={isSharePending}
            onClick={() => {
              // @ts-ignore
              startShareTransition(async () => {
                const result = await shareChat(chat.id)

                if (result && 'error' in result) {
                  toast.error(result.error)
                  return
                }

                copyShareLink(result)
              })
            }}
          >
            {isSharePending
              ? (
                <>
                  <IconSpinner className='mr-2 animate-spin' />
                  Copying...
                </>
              )
              : <>Copy link</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
