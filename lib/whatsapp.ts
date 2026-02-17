import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js'

let client: Client | null = null
let qrCode: string | null = null
let isReady = false

// ================= INITIALIZE WHATSAPP =================
export function initWhatsApp() {
  if (client) return

  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: 'whatsapp-session',
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  })

  client.on('qr', (qr) => {
    qrCode = qr
    isReady = false
  })

  client.on('ready', () => {
    isReady = true
    qrCode = null
    console.log('✅ WhatsApp READY')
  })

  client.on('disconnected', () => {
    console.log('❌ WhatsApp DISCONNECTED')
    isReady = false
    qrCode = null
    client = null
  })

  client.initialize()
}

// ================= STATUS =================
export function getWhatsAppStatus() {
  return {
    qr: qrCode,
    ready: isReady,
  }
}

// ================= SEND MESSAGE (TEXT / MEDIA) =================
export async function sendWhatsAppMessage(
  phone: string, // example: 9198xxxxxxxx
  content: string | MessageMedia,
  caption?: string
) {
  if (!client || !isReady) {
    throw new Error('WhatsApp not connected')
  }

  // TRY MODERN METHOD
  try {
    const numberId = await client.getNumberId(phone)

    if (numberId && numberId._serialized) {
      if (typeof content === 'string') {
        await client.sendMessage(numberId._serialized, content)
      } else {
        await client.sendMessage(numberId._serialized, content, {
          caption: caption || '',
        })
      }
      return
    }
  } catch (err) {
    // fallback silently
  }

  // FALLBACK METHOD
  const fallbackChatId = `${phone}@c.us`

  try {
    if (typeof content === 'string') {
      await client.sendMessage(fallbackChatId, content)
    } else {
      await client.sendMessage(fallbackChatId, content, {
        caption: caption || '',
      })
    }
  } catch (err) {
    throw new Error(
      'Unable to send message. Ask the client to message you once.'
    )
  }
}

// ================= ✅ NEW: SCHEDULER SAFE WRAPPER =================
export async function sendScheduledWhatsAppJob(params: {
  phone: string
  message?: string
  mediaUrl?: string
}) {
  // 🔐 ensure WhatsApp is initialized
  if (!client) {
    initWhatsApp()
  }

  if (!isReady) {
    throw new Error('WhatsApp not ready for scheduled job')
  }

  const { phone, message, mediaUrl } = params

  if (mediaUrl) {
    const media = await MessageMedia.fromUrl(mediaUrl)
    await sendWhatsAppMessage(phone, media, message)
  } else if (message) {
    await sendWhatsAppMessage(phone, message)
  } else {
    throw new Error('No message or media provided')
  }
}

// ================= LOGOUT =================
export async function logoutWhatsApp() {
  if (client) {
    await client.logout()
    client = null
    qrCode = null
    isReady = false
    console.log('🔒 WhatsApp LOGGED OUT')
  }
}
