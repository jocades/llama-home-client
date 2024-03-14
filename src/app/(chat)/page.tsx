import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat/chat'
import { handleChat } from '@/lib/services/openai'
import ollama from 'ollama'

export default async function IndexPage() {
  const id = nanoid()
  const { models } = await ollama.list()
  console.log(models)

  return <Chat id={id} models={models} />
}
