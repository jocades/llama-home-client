import { insertChat } from '@/app/actions'
import { useRef, useState } from 'react'
import { useLocalStorage } from './use-local-storage'
import ollama from 'ollama/browser'
import { UseChatOptions } from '../types'
import { nanoid } from 'nanoid'

export type Chat = {
  id: string
  title: string
  createdAt: number
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type Message = {
  id: string
  role: string // 'system' | 'user' | 'assistant'
  content: string
  model?: string
}

export function useChat(
  { id, initialMessages, body, onResponse, onFinish }: UseChatOptions,
) {
  const [model, setModel] = useLocalStorage<string>('model', 'llama2:latest')
  const [messages, setMessages] = useState<Message[]>(initialMessages ?? [])
  const [input, setInput] = useState('')
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState(false)

  const messagesRef = useRef(messages)

  const request = async (message: Message) => {
    setIsLoading(true)

    const res = await ollama.chat({
      model,
      messages: [...messages, message],
      stream: true,
    })

    const newMsg = {
      id: nanoid(),
      role: 'assistant',
      content: '',
      model,
    }

    setMessages((prev) => [...prev, newMsg])
    messagesRef.current = [...messagesRef.current, newMsg]

    for await (const part of res) {
      if (!part.done) {
        messagesRef.current = [
          ...messagesRef.current.slice(0, -1),
          {
            ...messagesRef.current[messagesRef.current.length - 1],
            content:
              messagesRef.current[messagesRef.current.length - 1].content +
              part.message.content,
          },
        ]
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          return [
            ...prev.slice(0, -1),
            {
              ...last,
              content: last.content + part.message.content,
            },
          ]
        })
      }
    }
    setIsLoading(false)
    await insertChat({ id, messages: messagesRef.current })
    onFinish?.()
  }

  const append = async (message: Message) => {
    console.log(model, message)
    setMessages((prev) => [...prev, message])
    messagesRef.current = [...messagesRef.current, message]
    await request(message)
  }

  // regenerate the last AI chat response
  const reload = async () => {
    const last = messagesRef.current[messagesRef.current.length - 1]
    if (last.role === 'assistant') {
      setMessages((prev) => prev.slice(0, -1))
      messagesRef.current = messagesRef.current.slice(0, -1)
      await request(messagesRef.current[messagesRef.current.length - 1]) // last user message
    }
  }

  const stop = () => {
    // TODO
  }

  return {
    messages,
    input,
    setInput,
    isLoading,
    append,
    reload,
    stop,
    model,
    setModel,
  }
}
