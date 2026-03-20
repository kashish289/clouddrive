'use client'
import { useCallback, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQueryClient } from '@tanstack/react-query'

export default function UploadDropzone() {
  const supabase = useSupabaseClient()
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `${new Date().getFullYear()}/${fileName}`

      await supabase.storage
        .from('drive')
        .upload(filePath, file, { upsert: true })

      // Insert metadata
      const { data: user } = await supabase.auth.getUser()
      await supabase
        .from('files')
        .insert({
          name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          storage_key: filePath,
          owner_id: user!.user!.id
        })
    }

    queryClient.invalidateQueries({ queryKey: ['root-folder'] })
    setUploading(false)
    event.target.value = ''
  }

  return (
    <div className="mb-8 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
      <input
        id="file-upload"
        type="file"
        multiple
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
            {uploading ? '⏳' : '📁'}
          </div>
          <p className="text-lg font-medium text-gray-900 mb-1">
            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, PDF up to 10MB
          </p>
        </div>
      </label>
    </div>
  )
}
