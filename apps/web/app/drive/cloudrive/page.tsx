'use client'
import { useParams } from 'next/navigation'
import FileGrid from '@/components/FileGrid'
import FolderTree from '@/components/FolderTree'
import UploadDropzone from '@/components/UploadDropzone'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function FolderPage() {
  const params = useParams()
  const folderId = params.folderId as string
  const supabase = useSupabaseClient()

  const { data: folder } = useQuery({
    queryKey: ['folder', folderId],
    queryFn: async () => {
      const { data } = await supabase
        .from('folders')
        .select(`
          *, 
          files!inner(*),
          children:folders!parent_id(*)
        `)
        .eq('id', folderId)
        .eq('is_deleted', false)
        .single()
      return data
    },
    enabled: !!folderId
  })

  return (
    <div className="flex flex-1">
      <aside className="w-64 bg-white border-r shrink-0">
        <FolderTree />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Breadcrumbs folderId={folderId} />
        <div className="p-8 flex flex-col flex-1 overflow-auto">
          <UploadDropzone folderId={folderId} />
          <FileGrid 
            files={folder?.files || []} 
            folders={folder?.children || []} 
          />
        </div>
      </div>
    </div>
  )
}
