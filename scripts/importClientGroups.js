require('dotenv').config({ path: '.env.local' })

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const ClientGroup = require('./models/ClientGroup.cjs')
const Counter = require('./models/Counter.cjs')

async function getNextId(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  return counter.seq
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connected (client-group import)')

  const dataDir = path.join(process.cwd(), 'data')
  const files = fs.readdirSync(dataDir)

  for (const file of files) {
    const records = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), 'utf-8')
    )

    for (const item of records) {
      if (!item.category_name) continue

      const name = item.category_name.trim()

      // skip duplicates
      const exists = await ClientGroup.findOne({ name })
      if (exists) continue

      const groupId = await getNextId('client-group')

      await ClientGroup.create({
        groupId,
        name,
        parent: null,
      })
    }
  }

  console.log('✅ Client groups imported with correct IDs')
  process.exit()
}

run().catch(err => {
  console.error('Import error:', err)
  process.exit(1)
})
