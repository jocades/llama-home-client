import { getChat, insertChat } from '@/app/actions'
import { useEffect, useRef, useState } from 'react'
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
  role: string //'system' | 'user' | 'assistant'
  content: string
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

  const append = async (message: Message & { id?: string }) => {
    console.log(model, message)

    setMessages((prev) => [...prev, message])
    messagesRef.current = [...messagesRef.current, message]

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
    }

    setMessages((prev) => [
      ...prev,
      newMsg,
    ])

    messagesRef.current = [
      ...messagesRef.current,
      newMsg,
    ]

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

    // using react the messages here will be empty if no initialMessages are provided
    // because the state is not updated until we return from this function
    await insertChat({ id, messages: messagesRef.current })

    onFinish?.()
  }

  // regenerate the last AI chat response
  const reload = async () => {
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
