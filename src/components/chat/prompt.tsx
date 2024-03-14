import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ImagePlusIcon, MicIcon } from 'lucide-react'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function Prompt({ onSubmit, input, setInput, isLoading }: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const fsRef = React.useRef<HTMLInputElement>(null)
  const [image, setImage] = React.useState<string | null>(null)

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className='relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12'>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 top-4 size-8 rounded-full bg-background p-0 sm:left-4',
              )}
            >
              <IconPlus />
            </button>
          </PopoverTrigger>
          <PopoverContent side='top' className='max-w-[100px] py-1 px-1'>
            <div className='flex space-x-2 items-center justify-center'>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => fsRef.current?.click()}
              >
                <ImagePlusIcon className='size-4' />
              </Button>
              <Button size='icon' variant='ghost'>
                <MicIcon className='size-4' />
              </Button>
              <input
                ref={fsRef}
                type='file'
                accept='image/png, image/jpeg'
                className='hidden'
                onChange={(e) => {
                  if (!e.target?.files || !fsRef.current) return

                  // image to b64 encoded string
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    setImage(e.target?.result as string)
                    console.log(e.target?.result)
                  }
                  reader.readAsDataURL(e.target.files[0])
                  fsRef.current.value = ''
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Send a message.'
          spellCheck={false}
          className='min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm'
        />
        <div className='absolute right-0 top-4 sm:right-4'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='submit'
                size='icon'
                disabled={isLoading || input === ''}
              >
                <IconArrowElbow />
                <span className='sr-only'>Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
