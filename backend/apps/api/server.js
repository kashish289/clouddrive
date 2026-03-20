const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const app = express()
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Auth middleware
const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })
  req.user = user
  next()
}

// Folders
app.post('/folders', requireAuth, async (req, res) => {
  const { name, parentId } = req.body
  const { data, error } = await supabase
    .from('folders')
    .insert({ name, owner_id: req.user.id, parent_id: parentId })
    .select()
    .single()
  if (error) return res.status(400).json(error)
  res.json(data)
})

app.get('/folders/:id', requireAuth, async (req, res) => {
  // Implementation...
})

app.listen(8080, () => {
  console.log('🚀 API running on http://localhost:8080')
})
