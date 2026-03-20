const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/init', auth, async (req, res) => {
  const supabase = req.app.locals.supabase
  const { name, mimeType, sizeBytes, folderId } = req.body

  // Validate file type
  const allowedTypes = ['image/', 'application/pdf', 'text/']
  if (!allowedTypes.some(type => mimeType.startsWith(type))) {
    return res.status(400).json({ error: 'Invalid file type' })
  }

  if (sizeBytes > 10 * 1024 * 1024 * 1024) { // 10GB
    return res.status(400).json({ error: 'File too large' })
  }

  const storageKey = `drive/${req.user.id}/${folderId || 'root'}/${Date.now()}-${name}`
  
  const { data: file, error } = await supabase
    .from('files')
    .insert({
      name,
      mime_type: mimeType,
      size_bytes: sizeBytes,
      storage_key: storageKey,
      owner_id: req.user.id,
      folder_id: folderId || null
    })
    .select()
    .single()

  if (error) return res.status(400).json(error)

  res.json({ 
    file,
    uploadUrl: supabase.storage.from('drive').getPublicUrl(storageKey).data.publicUrl
  })
})

module.exports = router
