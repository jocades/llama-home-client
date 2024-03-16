import { Separator } from '@/components/ui/separator'
import { ChatMessage } from './chat-message'
import { Message } from '@/lib/hooks/use-chat'

export interface ChatList {
  messages: Message[]
  showModel?: boolean
}

export function ChatList({ messages, showModel }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className='relative mx-auto max-w-2xl px-4'>
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} showModel={showModel} />
          {index < messages.length - 1 &&
            <Separator className='my-4 md:my-8' />}
        </div>
      ))}
    </div>
  )
}
