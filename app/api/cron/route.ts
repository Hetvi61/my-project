import { NextResponse } from 'next/server'

export async function GET() {
  console.log('Cron job executed')
  return NextResponse.json({ success: true })
}
