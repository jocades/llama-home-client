'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { type Chat } from '@/lib/types'
import fs from 'fs/promises'
import path from 'path'

const chatsPath = 'db/chats'
const p = (...args: string[]) => path.join(chatsPath, ...args)

const read = async <T>(path: string) => {
  try {
    return JSON.parse(await fs.readFile(path, 'utf-8')) as T
  } catch (err: any) {
    console.error('Chat not found', err)
  }
}

const write = async (path: string, payload: any) => {
  try {
    await fs.writeFile(path, JSON.stringify(payload), 'utf-8')
  } catch (err: any) {
    console.error('Error writing file', err)
  }
}

export async function getChats() {
  const chats = []
  for (const chatId of await fs.readdir(chatsPath)) {
    chats.push(await read(p(chatId, `c.json`)))
  }
  return chats.toReversed() as Chat[]
}

export async function getChat(id: string) {
  return {
    ...await read(p(id, `c.json`)) as Chat,
    messages: await read(p(id, `m.json`)) as Chat['messages'],
  }
}

export async function insertChat(chatId: string, payload: any) {
  const chatPath = p(chatId)
  await fs.mkdir(chatPath, { recursive: true })
  await write(path.join(chatPath, `c.json`), payload)
  await write(path.join(chatPath, `m.json`), payload.messages)
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  await fs
    .rm(path, { recursive: true })
    .catch((err: any) => console.error('Error removing chat', err))

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  await fs
    .rm(chatsPath, { recursive: true })
    .catch((err: any) => console.error('Error clearing chats', err))

  revalidatePath('/')
  return redirect('/')
}

export async function shareChat(id: string) {
  const chat = await getChat(id)

  if (!chat) {
    return {
      error: 'Chat not found',
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`,
  }

  await insertChat(chat.id, payload)

  return payload
}

// export async function getSharedChat(id: string) {
//   const chat = await kv.hgetall<Chat>(`chat:${id}`)

//   if (!chat || !chat.sharePath) {
//     return null
//   }

//   return chat
// }

// export async function shareChat(id: string) {
//   const session = await auth()

//   if (!session?.user?.id) {
//     return {
//       error: 'Unauthorized'
//     }
//   }

//   const chat = await kv.hgetall<Chat>(`chat:${id}`)

//   if (!chat || chat.userId !== session.user.id) {
//     return {
//       error: 'Something went wrong'
//     }
//   }

//   const payload = {
//     ...chat,
//     sharePath: `/share/${chat.id}`
//   }

//   await kv.hmset(`chat:${chat.id}`, payload)

//   return payload
// }
