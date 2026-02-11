import { NextResponse } from 'next/server'
import {
  initWhatsApp,
  sendWhatsAppMessage,
  getWhatsAppStatus,
} from '@/lib/whatsapp'

export async function POST(req: Request) {
  try {
    const { phone, message } = await req.json()

    if (!phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Phone and message required' },
        { status: 400 }
      )
    }

    // Initialize WhatsApp
    initWhatsApp()

    const status = getWhatsAppStatus()
    if (!status.ready) {
      return NextResponse.json(
        { success: false, error: 'WhatsApp not connected' },
        { status: 400 }
      )
    }

    //  STEP 1: remove all non-digits
    const rawPhone = phone.replace(/\D/g, '') // 9512020039

    //  STEP 2: add India country code if missing
    const cleanPhone =
      rawPhone.length === 10 ? `91${rawPhone}` : rawPhone
    // Result: 919512020039

    //  STEP 3: send using CLEAN PHONE ONLY
    await sendWhatsAppMessage(cleanPhone, message)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Send text error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}


