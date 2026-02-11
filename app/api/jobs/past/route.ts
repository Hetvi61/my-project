import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import PastJob from '@/models/PastJob'

export async function GET() {
  await connectDB()

  // ✅ client_name is stored directly, no populate needed
  const jobs = await PastJob.find().sort({ delivered_datetime: 1 })

  return NextResponse.json(jobs)
}

