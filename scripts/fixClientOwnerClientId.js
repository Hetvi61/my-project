require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')

const Client = require('./models/Clientss').default || require('./models/Clientss')
const ClientOwner = require('./models/ClientOwner').default || require('./models/ClientOwner')

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connected (fix owners)')

  const owners = await ClientOwner.find()

  for (const o of owners) {
    // try to resolve by stored clientName
    const client = await Client.findOne({
      $or: [
        { clientName: o.clientName },
        { ClientName: o.clientName },
      ],
    })

    if (!client) {
      console.log('❌ Could not fix owner:', o._id, o.clientName)
      continue
    }

    await ClientOwner.updateOne(
      { _id: o._id },
      { $set: { clientId: client._id } }
    )

    console.log('✅ Fixed owner:', o._id, '→', client.clientName || client.ClientName)
  }

  console.log('DONE fixing owners')
  process.exit()
}

run().catch(console.error)