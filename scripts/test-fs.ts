import { Chat } from '@/lib/types'
import fs from 'fs/promises'
import path from 'path'

// use the file system as a database to the the chats and its messages

// db/chats/<chatId>/c.json -> chat general info
// db/chats/<chatId>/m.json -> chat messages
// const payload = {
//   id: chatId,
//   title,
//   // userId,
//   createdAt,
//   path: `/chat/${chatId}`, -> maybe not needed
//   messages: [
//     ...messages,
//     {
//       role: 'assistant',
//       content: completion,
//     },
//   ],
// }

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

async function getChat(id: string) {
  console.log(await read(p(id, `c.json`)))
}

async function getChats() {
  const chatIds = await fs.readdir(chatsPath)
  const chats = []
  for (const id of chatIds) {
    chats.push(await read(p(id, `c.json`)))
  }
  console.log(chats.toReversed())
}

async function writeChat(chatId: string, payload: any) {
  const chatPath = p(chatId)
  await fs.mkdir(chatPath, { recursive: true })
  await fs.writeFile(
    path.join(chatPath, `c.json`),
    JSON.stringify(payload),
    'utf-8',
  )
  await fs.writeFile(
    path.join(chatPath, `m.json`),
    JSON.stringify(payload.messages),
    'utf-8',
  )
}

async function removeChat(chatId: string) {
  const chatPath = path.join(chatsPath, chatId)
  await fs.rm(chatPath, { recursive: true })
}

getChat('1')
getChats()
