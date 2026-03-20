-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users (synced with Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Folders (hierarchy)
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX folders_owner_parent_name_unique 
ON folders(owner_id, parent_id, name) WHERE NOT is_deleted;
CREATE INDEX idx_folders_owner_parent ON folders(owner_id, parent_id);
CREATE INDEX idx_folders_name_trgm ON folders USING GIN (name gin_trgm_ops);

-- Files
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  storage_key TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  checksum TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_files_owner ON files(owner_id);
CREATE INDEX idx_files_folder ON files(folder_id) WHERE NOT is_deleted;
CREATE INDEX idx_files_name_trgm ON files USING GIN (name gin_trgm_ops);

-- Shares (user ACL)
CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT CHECK (resource_type IN ('file', 'folder')) NOT NULL,
  resource_id UUID NOT NULL,
  grantee_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('viewer', 'editor')) NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_type, resource_id, grantee_user_id)
);

-- Public links
CREATE TABLE link_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT CHECK (resource_type IN ('file', 'folder')) NOT NULL,
  resource_id UUID NOT NULL,
  token TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_link_shares_token ON link_shares(token);

-- Stars
CREATE TABLE stars (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resource_type TEXT CHECK (resource_type IN ('file', 'folder')) NOT NULL,
  resource_id UUID NOT NULL,
  PRIMARY KEY (user_id, resource_type, resource_id)
);

-- RLS Policies
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own folders" ON folders
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Users can view shared folders" ON folders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM shares 
            WHERE resource_id = folders.id 
            AND grantee_user_id = auth.uid())
  );
