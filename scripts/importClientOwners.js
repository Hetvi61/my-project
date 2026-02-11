require('dotenv').config({ path: '.env.local' })

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const Client = require('./models/Clientss')
const ClientOwner = require('./models/ClientOwner')

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connected (owner import)')

  const dataDir = path.join(process.cwd(), 'data')
  const files = fs.readdirSync(dataDir).sort()

  for (const file of files) {
    const records = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), 'utf-8')
    )

    for (const item of records) {
      if (!Array.isArray(item.contacts)) continue

      // 🔍 FIND CLIENT
      const client = await Client.findOne({
        $or: [
          { clientName: item.company_name },
          { ClientName: item.company_name },
        ],
      })

      if (!client) {
        console.log('❌ Client not found for:', item.company_name)
        continue
      }

      // ✅ RESOLVE CLIENT NAME SAFELY
      const resolvedClientName =
        client.clientName ||
        client.ClientName ||
        client.companyName ||
        client.name

      if (!resolvedClientName) {
        console.log('❌ Could not resolve clientName for:', client._id)
        continue
      }

      const emails = Array.isArray(item.email) ? item.email : []

      for (let i = 0; i < item.contacts.length; i++) {
        const contact = item.contacts[i]
        if (!contact.name) continue

        // ✅ CREATE OWNER WITH REQUIRED clientName
        await ClientOwner.create({
          clientId: client._id,
          clientName: resolvedClientName,   // 🔥 REQUIRED FIELD
          ownerName: contact.name,
          mobile: contact.mobile || '',
          email: emails[i] || '',
        })

        console.log(
          '✅ Owner imported:',
          contact.name,
          'for',
          resolvedClientName
        )
      }
    }
  }

  console.log('✅ Client owners imported successfully')
  process.exit()
}

run().catch(err => {
  console.error('❌ Import error:', err)
  process.exit(1)
})

