import { Sidebar } from './sidebar'

import { ChatHistory } from './chat-history'

export async function SidebarDesktop() {
  const userId = await new Promise<string>((res) => {
    console.log('loading user id')
    setTimeout(() => res('123'), 100)
  })

  return (
    <Sidebar className='peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]'>
      <ChatHistory userId={userId} />
    </Sidebar>
  )
}
