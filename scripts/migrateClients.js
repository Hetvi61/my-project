import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'

// 🔹 DEFINE SCHEMA LOCALLY FOR SCRIPT
const ClientSchema = new mongoose.Schema(
  {
    clientId: Number,
    clientName: String,
    companyName: String,
    name: String,
    createdAt: Date,
  },
  { strict: false }
)

const CounterSchema = new mongoose.Schema({
  name: String,
  seq: Number,
})

const Client = mongoose.model('Client', ClientSchema)
const Counter = mongoose.model('Counter', CounterSchema)

// ======================
// RUN MIGRATION
// ======================
await mongoose.connect(process.env.MONGODB_URI)

// 1️⃣ Get all clients in created order
const clients = await Client.find().sort({ createdAt: 1 })

let seq = 0

for (const c of clients) {
  seq++

  const fixedName =
    c.clientName ||
    c.companyName ||
    c.name ||
    'Unknown'

  await Client.updateOne(
    { _id: c._id },
    {
      $set: {
        clientId: seq,
        clientName: fixedName,
      },
    }
  )
}

// 2️⃣ Sync counter
await Counter.findOneAndUpdate(
  { name: 'client' },
  { $set: { seq } },
  { upsert: true }
)

console.log('✅ Client migration completed successfully!')
process.exit()
