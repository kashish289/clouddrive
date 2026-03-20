'use client'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Breadcrumbs({ folderId }: { folderId?: string }) {
  const supabase = useSupabaseClient()

  const { data: path } = useQuery({
    queryKey: ['breadcrumbs', folderId],
    queryFn: async () => {
      if (!folderId) return []
      
      // Recursive CTE for breadcrumbs
      const { data } = await supabase.rpc('get_folder_path', { folder_id: folderId })
      return data || []
    },
    enabled: !!folderId
  })

  return (
    <nav className="bg-white border-b px-8 py-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/drive" className="text-blue-600 hover:underline">My Drive</Link>
        </li>
        {path?.map((folder: any, i: number) => (
          <li key={folder.id} className="flex items-center">
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link 
              href={`/drive/${folder.id}`}
              className="text-gray-900 hover:underline truncate max-w-32"
            >
              {folder.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
