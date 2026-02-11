

function generateClientId() {
  return `CLI-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

require('dotenv').config({ path: '.env.local' })

const fs = require('fs')
const path = require('path')
const { connectDB } = require('./db')
const Client = require('./models/Clientss')

async function importClients() {
  await connectDB()



  await Client.deleteMany({ clientId: null })

  const dataDir = path.join(process.cwd(), 'data')
  const files = fs.readdirSync(dataDir)

  for (const file of files) {
    const filePath = path.join(dataDir, file)
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    for (const item of jsonData) {
      const clientName = item.company_name || ''

      const email = Array.isArray(item.email)
        ? item.email.join(', ')
        : ''

      const contactMobiles = Array.isArray(item.contacts)
        ? item.contacts.map(c => c.mobile).filter(Boolean)
        : []

      const phoneNumbers = Array.isArray(item.phone)
        ? item.phone.filter(Boolean)
        : []

      const allNumbers = [...contactMobiles, ...phoneNumbers]

      let mobile = ''
      let phone = ''

      if (allNumbers.length <= 2) {
        // 1 or 2 numbers → mobile
        mobile = allNumbers.join(', ')
      } else {
        // more than 2 numbers
        mobile = allNumbers.slice(0, 2).join(', ')
        phone = allNumbers.slice(2).join(', ')
      }

      const clientData = {
        clientId: generateClientId(),
        clientName,
        email,
        mobile,
        phone,
        businessCategory: item.category_name || '',
        clientGroup: item.client_group || '',
        targetAudience: '',
        website: '',
        services: '',
        demographics: '',
        productDetails: item.product_details || '',
      }

      


      await Client.create(clientData)
    }
  }

  console.log(' All clients imported successfully')
  process.exit()
}

importClients().catch(err => {
  console.error(' Import error:', err)
  process.exit(1)
})
