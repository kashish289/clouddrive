'use client'
import { File } from '@/types'

interface Props {
  files: File[]
  folders: any[]
}

export default function FileGrid({ files, folders }: Props) {
  return (
    <div className="file-grid pt-8">
      {folders.map(folder => (
        <div key={folder.id} className="file-card cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
            📁
          </div>
          <div className="font-medium truncate">{folder.name}</div>
          <div className="text-sm text-gray-500">Folder</div>
        </div>
      ))}
      {files.map(file => (
        <div key={file.id} className="file-card cursor-pointer">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
            📄
          </div>
          <div className="font-medium truncate">{file.name}</div>
          <div className="text-sm text-gray-500">{(file.size_bytes / 1024).toFixed(0)} KB</div>
        </div>
      ))}
    </div>
  )
}
