import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'

const ClientSchema = new mongoose.Schema({}, { strict: false })
const Client = mongoose.model('Client', ClientSchema)

await mongoose.connect(process.env.MONGODB_URI)

// 1️⃣ Copy ClientName → clientName
const copyResult = await Client.updateMany(
  { ClientName: { $exists: true } },
  { $set: { clientName: '$ClientName' } }
)

console.log('✅ Copied ClientName to clientName:', copyResult.modifiedCount)

// 2️⃣ Remove old ClientName field
const unsetResult = await Client.updateMany(
  { ClientName: { $exists: true } },
  { $unset: { ClientName: '' } }
)

console.log('✅ Removed old ClientName field:', unsetResult.modifiedCount)

process.exit()

