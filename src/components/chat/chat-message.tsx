import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from './chat-message-actions'
import { Message } from '@/lib/hooks/use-chat'
import { BotIcon } from 'lucide-react'

export interface ChatMessageProps {
  message: Message
  showModel?: boolean
}

export function ChatMessage(
  { message, showModel, ...props }: ChatMessageProps,
) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div className='flex flex-col gap-1'>
        <div
          className={cn(
            'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
            isUser ? 'bg-background' : 'bg-primary text-primary-foreground',
          )}
        >
          {isUser ? <IconUser /> : <BotIcon className='w-5 h-5' />}
        </div>
        {!isUser && showModel && (
          <div className='absolute -top-4 text-xs text-muted-foreground'>
            {message.model?.split(':')[0]}
          </div>
        )}
      </div>

      <div className='flex-1 px-1 ml-4 space-y-2 overflow-hidden'>
        <MemoizedReactMarkdown
          className='prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0'
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className='mb-2 last:mb-0'>{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className='mt-1 cursor-default animate-pulse'>▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}
