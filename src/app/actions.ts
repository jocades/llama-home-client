'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
import { nanoid } from '@/lib/utils'
import { Chat, Message } from '@/lib/hooks/use-chat'

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
    chats.push(await read(p(chatId, `c.json`)) as Chat)
  }

  // order by createdAt
  return chats.sort((a, b) => b.createdAt - a.createdAt)
  // return chats.toReversed() as Chat[]
}

export async function getChat(id: string) {
  return {
    ...await read(p(id, `c.json`)) as Chat,
    messages: await read(p(id, `m.json`)) as Chat['messages'],
  }
}

export async function insertChat(
  payload: { id?: string; messages: Omit<Message, 'id'>[]; sharePath?: string },
) {
  const title = payload.messages[0]?.content?.substring(0, 100)
  const id = payload.id ?? nanoid()
  const createdAt = Date.now()
  const sharePath = payload.sharePath ?? null

  const chat = {
    id,
    title,
    createdAt,
    sharePath,
    path: `/c/${id}`,
  }

  const chatPath = p(chat.id)
  await fs.mkdir(chatPath, { recursive: true })
  await write(path.join(chatPath, `c.json`), chat)
  if (payload.messages.length > 0) {
    await write(path.join(chatPath, `m.json`), payload.messages)
  }

  console.log('Chat inserted', {
    id,
    title,
    createdAt,
    sharePath,
    messages: payload.messages.length,
  })
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  await fs
    .rm(p(id), { recursive: true })
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
  const chat = await read(p(id, `c.json`)) as Chat

  if (!chat) {
    return {
      error: 'Chat not found',
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`,
  }

  await write(p(id, `c.json`), payload)

  return payload
}

export async function getSharedChat(id: string) {
  const chat = await getChat(id)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function refreshHistory(path: string) {
  redirect(path)
}

// export async function getSharedChat(id: string) {
//   const chat = await kv.hgetall<Chat>(`chat:${id}`)

//   if (!chat || !chat.sharePath) {
//     return null
//   }

//   return chat
// }
