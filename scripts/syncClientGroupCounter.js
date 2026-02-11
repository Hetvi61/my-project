require('dotenv').config({ path: '.env.local' })

const mongoose = require('mongoose')
const Counter = require('./models/Counter.cjs')
const ClientGroup = require('./models/ClientGroup.cjs')

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connected (sync client-group counter)')

  // 🔍 Find max groupId
  const max = await ClientGroup.findOne().sort({ groupId: -1 }).lean()

  const maxId = max?.groupId || 0

  // 🔄 Update counter
  await Counter.findOneAndUpdate(
    { name: 'client-group' },
    { $set: { seq: maxId } },
    { upsert: true }
  )

  console.log(`✅ ClientGroup counter synced to ${maxId}`)
  process.exit()
}

run().catch(err => {
  console.error('Sync error:', err)
  process.exit(1)
})
