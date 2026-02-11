import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

console.log('MONGODB_URI:', process.env.MONGODB_URI)

import mongoose from 'mongoose'

const ClientSchema = new mongoose.Schema({}, { strict: false })
const Client = mongoose.model('Client', ClientSchema)

await mongoose.connect(process.env.MONGODB_URI)

const clients = await Client.find()

let fixed = 0

for (const c of clients) {
  // If bad value like "$ClientName"
  if (c.clientName === '$ClientName') {
    // Try to recover from old fields
    const realName =
      c.clientName ||
      c.companyName ||
      c.name ||
      ''

    if (realName) {
      c.clientName = realName
      await c.save()
      fixed++
    }
  }
}

console.log('✅ Fixed bad $ClientName values:', fixed)
process.exit()
