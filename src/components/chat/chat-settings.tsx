'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Settings2Icon } from 'lucide-react'
import { Checkbox } from '../ui/checkbox'
import { Button } from '@/components/ui/button'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { ModelResponse } from 'ollama/browser'

interface ChatSettingsProps {
  model: string
  setModel: (name: string) => void
  models: ModelResponse[]
  showModel: boolean
  setShowModel: (show: boolean) => void
}

export function ChatSettings(
  { models, model, setModel, showModel, setShowModel }: ChatSettingsProps,
) {
  return (
    <div className='flex items-center justify-between px-8 py-4 w-full'>
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
      <div />
    </div>
  )
}
