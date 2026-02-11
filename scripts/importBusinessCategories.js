require('dotenv').config({ path: '.env.local' })

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const BusinessCategory = require('./models/BusinessCategory.cjs')

function normalize(name) {
  return name.trim().toUpperCase()
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connected')

  const dataDir = path.join(process.cwd(), 'data')
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'))

  let categoryId = 1
  const seen = new Set()

  for (const file of files) {
    const records = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), 'utf-8')
    )

    for (const item of records) {
      if (!item.category_name) continue

      const name = normalize(item.category_name)

      // ✅ prevent duplicates manually
      if (seen.has(name)) continue
      seen.add(name)

      await BusinessCategory.updateOne(
        { name },
        {
          $setOnInsert: {
            categoryId,
            name,
          },
        },
        { upsert: true }
      )

      categoryId++
    }
  }

  console.log('Business categories imported successfully')
  process.exit()
}

run().catch(err => {
  console.error('Import error:', err)
  process.exit(1)
})
