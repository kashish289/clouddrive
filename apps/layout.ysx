import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CloudDrive',
  description: 'Your files, secured and organized',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        <main className="flex h-[calc(100vh-64px)] bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
