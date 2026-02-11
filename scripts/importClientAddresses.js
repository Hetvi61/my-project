require('dotenv').config({ path: '.env.local' })

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Client = require('./models/Clientss')
const ClientAddress = require('./models/ClientAddress')

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)

  const dataDir = path.join(process.cwd(), 'data')
  const files = fs.readdirSync(dataDir)

  for (const file of files) {
    const records = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), 'utf-8')
    )

    for (const item of records) {
      const client = await Client.findOne({
        clientName: item.company_name,
      })

      if (!client || !item.address) continue

      await ClientAddress.create({
        clientId: client._id,
        clientName: client.clientName,   // ✅ SAVE NAME
        addressType: 'Office',
        address: item.address,
      })
    }
  }

  console.log('✅ Client addresses imported')
  process.exit()
}

run()

