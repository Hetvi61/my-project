import { NextResponse } from 'next/server'
import { startJobScheduler } from '@/lib/jobScheduler'

let initialized = false

export async function GET() {
  if (!initialized) {
    startJobScheduler()
    initialized = true
  }

  return NextResponse.json({ ok: true })
}
