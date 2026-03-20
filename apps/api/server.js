const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const app = express()
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json())

// Supabase client
app.locals.supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Routes
app.use('/api/folders', require('./routes/folders'))
app.use('/api/files', require('./routes/files'))
app.use('/api/auth', require('./routes/auth'))

app.get('/health', (req, res) => res.json({ status: 'OK' }))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`🚀 CloudDrive API running on port ${PORT}`)
})
