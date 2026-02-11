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
    console.log(' WhatsApp READY')
  })

  client.on('disconnected', () => {
    console.log(' WhatsApp DISCONNECTED')
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
  phone: string, // clean number only: 9198xxxxxxx
  content: string | MessageMedia,
  caption?: string
) {
  if (!client || !isReady) {
    throw new Error('WhatsApp not connected')
  }

  //  TRY MODERN METHOD (BEST)
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
    // silently fallback
  }

  //  FALLBACK METHOD (LEGACY BUT NECESSARY)
  const fallbackChatId = `${phone}@c.us`

  try {
    if (typeof content === 'string') {
      await client.sendMessage(fallbackChatId, content)
    } else {
      await client.sendMessage(fallbackChatId, content, {
        caption: caption || '',
      })
    }
    return
  } catch (err) {
    throw new Error(
      'Unable to send message. WhatsApp cannot resolve this chat. Ask the client to message you once.'
    )
  }
}

// ================= LOGOUT =================
export async function logoutWhatsApp() {
  if (client) {
    await client.logout()
    client = null
    qrCode = null
    isReady = false
    console.log(' WhatsApp LOGGED OUT')
  }
}
