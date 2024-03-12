import './globals.css'
import type { Metadata } from 'next'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from './_providers'
import { cn } from '@/lib/utils'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/header'

export const metadata = {
  title: {
    default: 'Ollama AI Chatbot',
    template: `%s - Ollama AI Chatbot`,
  },
  description: 'An AI-powered chatbot template built with Next.js and Vercel.',
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
} satisfies Metadata

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function Root(props: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Providers>
          <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex flex-col flex-1 bg-muted/50'>
              {props.children}
            </main>
          </div>
          <TailwindIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
