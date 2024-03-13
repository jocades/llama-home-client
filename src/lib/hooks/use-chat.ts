import { getChat } from '@/app/actions'
import { useEffect, useState } from 'react'
import { useLocalStorage } from './use-local-storage'
import { UseChatOptions } from '../types'

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
  role: 'system' | 'user' | 'assistant'
  content: string
}

function useChat(
  { id, initialMessages, body, onResponse, model }: UseChatOptions,
) {
  // const navigate = useNavigate()

  const [chatId, setChatId] = useLocalStorage<string | null>(
    'ollama:chatId',
    null,
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState(false)

  model = model ?? 'llama2'

  useEffect(() => {
    console.log('chatId', chatId)
    if (chatId) {
      console.log('fetching chat')
      getChat(chatId)
        .then((res) => setMessages(res.messages))
    }
  }, [chatId])

  const append = async (message: Message & { id?: number }) => {
    console.log(model, message)

    setMessages((prev) => [
      ...prev,
      message,
    ])

    setIsLoading(true)
    const res = await ollama.chat({
      model,
      messages: [
        ...messages,
        message,
      ],
      stream: true,
    })

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '' },
    ])

    for await (const part of res) {
      if (!part.done) {
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

    if (!chatId) {
      const { chat_id } = await createChat(
        message.content.substring(0, 100),
      )
      setChatId(chat_id.toString())
      await sendMessage(chat_id, messages)
      // navigate(`/chat/${chat_id}`)
    } else {
      await sendMessage(chatId, message)
    }
  }

  // regenerate the last AI chat response
  const reload = async () => {
    const lastMessage = messages[messages.length - 1]

    if (lastMessage.role === 'user') {
      setMessages(messages.slice(1, -1))
      setIsLoading(true)
      const res = await ollama.chat({
        model,
        messages: messages.slice(0, -1),
        stream: false,
      })
      setIsLoading(false)
      setMessages((prev) => [
        ...prev,
        res.message,
      ])
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
    chatId,
    setChatId,
  }
}
