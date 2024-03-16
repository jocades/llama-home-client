'use client'

import * as React from 'react'
import { toast } from 'react-hot-toast'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'
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
import { Message, useChat } from '@/lib/hooks/use-chat'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { ModelResponse } from 'ollama/browser'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Settings2Icon } from 'lucide-react'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id: string
  models: ModelResponse[]
}

export function Chat(
  { id, initialMessages, className, models }: ChatProps,
) {
  const path = usePathname()

  const [showModel, setShowModel] = useLocalStorage('showModel', true)

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
    body: {
      id,
      previewToken,
    },
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
      <div className='flex flex-1 items-center justify-between px-8 py-4 w-full'>
        <div />
        <Select
          value={model}
          onValueChange={(name) => setModel(name)}
        >
          <SelectTrigger className='max-w-[200px]'>
            <SelectValue placeholder='Select a model' />
          </SelectTrigger>
          <SelectContent>
            {models?.map((model) => (
              <SelectItem key={model.name} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className='size-10 rounded-full p-0'
              variant='outline'
            >
              <Settings2Icon className='size-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='max-w-[200px]'>
            <div className='flex items-center justify-between text-sm'>
              {/* <Label className='text-sm'>Show model</Label> */}
              <p className='text-sm'>Show model</p>
              <Checkbox checked={showModel} onCheckedChange={setShowModel} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {messages.length
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
