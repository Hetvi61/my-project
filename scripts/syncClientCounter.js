require('dotenv').config({ path: '.env.local' })

const mongoose = require('mongoose')
const Client = require('./models/Clientss')
const Counter = require('./models/Counter.cjs')

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connected (sync client counter)')

  // 🔥 ONLY NUMERIC clientId
  const max = await Client.findOne({
    clientId: { $type: 'number' }
  })
    .sort({ clientId: -1 })
    .lean()

  const maxId = max?.clientId || 0

  await Counter.findOneAndUpdate(
    { name: 'client' },
    { $set: { seq: maxId } },
    { upsert: true }
  )

  console.log('✅ Client counter synced to', maxId)
  process.exit()
}

run().catch(err => {
  console.error('Sync error:', err)
  process.exit(1)
})

