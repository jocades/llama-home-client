'use client'

import * as React from 'react'
import { toast } from 'react-hot-toast'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@/lib/utils'
import { refreshHistory } from '@/app/actions'
import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { EmptyScreen } from '@/components/chat/empty-screen'
import { usePathname } from 'next/navigation'
import { Message, useChat } from '@/lib/hooks/use-chat'
import { ModelResponse } from 'ollama/browser'
import { ChatSettings } from './chat-settings'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id: string
  models: ModelResponse[]
}

export function Chat(
  { id, initialMessages, className, models }: ChatProps,
) {
  const path = usePathname()

  const [, setNewChatId] = useLocalStorage<string | null>(
    'newChatId',
    null,
  )

  const [showModel, setShowModel] = useLocalStorage('showModel', true)

  const {
    messages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
    model,
    setModel,
  } = useChat({
    initialMessages,
    id,
    body: { id },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText)
      }
    },
    async onFinish() {
      if (!path.includes('/c/')) {
        setNewChatId(id)
        await refreshHistory(`/c/${id}`)
      }
    },
  })

  return (
    <>
      <ChatSettings
        models={models}
        model={model}
        setModel={setModel}
        showModel={showModel}
        setShowModel={setShowModel}
      />
      {messages.length > 0
        ? (
          <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
            <ChatList messages={messages} showModel={showModel} />
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
    </>
  )
}
