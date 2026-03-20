'use client'
import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import FileGrid from '@/components/FileGrid'
import FolderTree from '@/components/FolderTree'
import UploadDropzone from '@/components/UploadDropzone'

export default function Drive() {
  const supabase = useSupabaseClient()
  
  const { data: rootFolder } = useQuery({
    queryKey: ['root-folder'],
    queryFn: async () => {
      const { data } = await supabase
        .from('folders')
        .select('*, files(*), children_folders:folders(*)')
        .eq('parent_id', null)
        .eq('is_deleted', false)
        .single()
      return data
    }
  })

  return (
    <div className="flex flex-1">
      <aside className="w-64 bg-white border-r shrink-0">
        <FolderTree />
      </aside>
      <div className="flex-1 p-8 flex flex-col">
        <UploadDropzone />
        <FileGrid files={rootFolder?.files || []} folders={rootFolder?.children_folders || []} />
      </div>
    </div>
  )
}
