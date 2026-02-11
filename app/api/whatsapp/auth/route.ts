import { NextResponse } from 'next/server'
import { initWhatsApp, getWhatsAppStatus } from '@/lib/whatsapp'

export async function GET() {
  initWhatsApp()

  const status = getWhatsAppStatus()

  return NextResponse.json(status)
}
