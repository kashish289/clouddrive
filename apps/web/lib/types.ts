export interface File {
  id: string
  name: string
  mime_type: string
  size_bytes: number
  storage_key: string
  owner_id: string
  folder_id: string | null
  created_at: string
}

export interface Folder {
  id: string
  name: string
  owner_id: string
  parent_id: string | null
  created_at: string
}
