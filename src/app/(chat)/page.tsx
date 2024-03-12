import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat/chat'
import { handleChat } from '@/lib/services/openai'

export default function IndexPage() {
  const id = nanoid()

  return <Chat id={id} api={handleChat} />
}
