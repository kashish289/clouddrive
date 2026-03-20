'use client'
import Link from 'next/link'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const supabase = useSupabaseClient()
  const pathname = usePathname()
  
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-white shadow-sm border-b h-16 px-6 flex items-center">
      <Link href="/drive" className="text-2xl font-bold text-blue-600">
        CloudDrive
      </Link>
      
      <div className="ml-auto flex items-center gap-4">
        <Link 
          href="/drive" 
          className={`px-4 py-2 rounded-md ${
            pathname === '/drive' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Drive
        </Link>
        
        <Button onClick={signOut} variant="ghost">
          Sign Out
        </Button>
      </div>
    </nav>
  )
}
