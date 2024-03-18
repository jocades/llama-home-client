import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import ollama from 'ollama'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const chat = await getChat(params.id)
  return {
    title: chat?.title?.toString()?.slice(0, 50) ?? 'Chat',
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chat = await getChat(params.id)
  const { models } = await ollama.list()

  if (!chat) {
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} models={models} />
}
