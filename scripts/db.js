const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables')
  process.exit(1)
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return

  await mongoose.connect(MONGODB_URI)
  console.log('MongoDB connected (script)')
}

module.exports = { connectDB }
