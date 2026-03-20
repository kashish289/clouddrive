const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// List folders
router.get('/', auth, async (req, res) => {
  const supabase = req.app.locals.supabase
  const { parent_id, limit = 50 } = req.query
  
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('owner_id', req.user.id)
    .eq('parent_id', parent_id || null)
    .eq('is_deleted', false)
    .limit(limit)
    .order('name')

  if (error) return res.status(400).json(error)
  res.json(data)
})

// Create folder
router.post('/', auth, async (req, res) => {
  const supabase = req.app.locals.supabase
  const { name, parent_id } = req.body

  // Check name collision
  const { data: existing } = await supabase
    .from('folders')
    .select('id')
    .eq('owner_id', req.user.id)
    .eq('parent_id', parent_id || null)
    .eq('name', name)
    .eq('is_deleted', false)

  if (existing?.length > 0) {
    return res.status(409).json({ error: 'Folder name already exists' })
  }

  const { data, error } = await supabase
    .from('folders')
    .insert({ name, owner_id: req.user.id, parent_id: parent_id || null })
    .select()
    .single()

  if (error) return res.status(400).json(error)
  res.json(data)
})

module.exports = router
