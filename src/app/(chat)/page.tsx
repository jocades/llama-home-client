import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat/chat'
import ollama from 'ollama'

export default async function IndexPage() {
  const id = nanoid()
  const { models } = await ollama.list()

  return <Chat id={id} models={models} />
}
