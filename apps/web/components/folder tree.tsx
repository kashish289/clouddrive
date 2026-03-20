'use client'
import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'

export default function FolderTree() {
  const supabase = useSupabaseClient()

  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const { data } = await supabase
        .from('folders')
        .select('*')
        .eq('is_deleted', false)
        .order('name')
      return data
    }
  })

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4 text-gray-900">📁 Folders</h3>
      <ul className="space-y-1">
        {folders?.map(folder => (
          <li key={folder.id}>
            <Link 
              href={`/drive/${folder.id}`}
              className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              📁 {folder.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
