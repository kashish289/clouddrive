'use client'
import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import FileGrid from '@/components/FileGrid'
import FolderTree from '@/components/FolderTree'
import UploadDropzone from '@/components/UploadDropzone'
import { useEffect } from 'react'

export default function Drive() {
  const supabase = useSupabaseClient()
  const user = useUser()

  const { data: rootContents } = useQuery({
    queryKey: ['drive-root', user?.id],
    queryFn: async () => {
      const [{ data: folders }, { data: files }] = await Promise.all([
        supabase
          .from('folders')
          .select('*')
          .eq('owner_id', user!.id)
          .eq('parent_id', null)
          .eq('is_deleted', false),
        supabase
          .from('files')
          .select('*')
          .eq('owner_id', user!.id)
          .eq('folder_id', null)
          .eq('is_deleted', false)
      ])
      return { folders: folders || [], files: files || [] }
    },
    enabled: !!user
  })

  return (
    <div className="flex h-full">
      <aside className="w-64 bg-white border-r shrink-0 overflow-auto">
        <FolderTree />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 flex flex-col flex-1 overflow-auto bg-gray-50">
          <UploadDropzone />
          <FileGrid 
            files={rootContents?.files || []} 
            folders={rootContents?.folders || []} 
          />
        </div>
      </div>
    </div>
  )
}
