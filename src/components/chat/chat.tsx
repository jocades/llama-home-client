'use client'

import * as React from 'react'
import { type Message, useChat } from 'ai/react'
import { toast } from 'react-hot-toast'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { StreamingReactResponseAction } from '@/lib/types'
import { cn } from '@/lib/utils'
import { insertChat, refreshHistory } from '@/app/actions'
import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { EmptyScreen } from '@/components/chat/empty-screen'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePathname } from 'next/navigation'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id: string
  api: StreamingReactResponseAction
}

export function Chat({ id, initialMessages, className, api }: ChatProps) {
  const path = usePathname()
  const [, setNewChatId] = useLocalStorage<string | null>(
    'newChatId',
    null,
  )
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null,
  )
  const [previewTokenDialog, setPreviewTokenDialog] = React.useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = React.useState(
    previewToken ?? '',
  )

  // const cachedApi = React.useMemo(
  //   () => api?.bind(null, { id, previewToken }),
  //   [api, id, previewToken],
  // )

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      // api: cachedApi,
      api: '/api/chat',
      initialMessages,
      id,
      body: {
        id,
        previewToken,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      },
      async onFinish(msg) {
        console.log('LAST_MESSAGE', msg)
        console.log('MESSAGES', messages)
        // await insertChat({ id, messages })

        // if (!path.includes('/c/')) {
        //   setNewChatId(id)
        //   await refreshHistory(`/c/${id}`)
        // }
      },
    })

  return (
    <>
      {messages.length
        ? (
          <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </div>
        )
        : <EmptyScreen setInput={setInput} />}
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by
              {' '}
              <a
                href='https://platform.openai.com/signup/'
                className='underline'
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className='font-mono'>ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder='OpenAI API key'
            onChange={(e) => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className='items-center'>
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
