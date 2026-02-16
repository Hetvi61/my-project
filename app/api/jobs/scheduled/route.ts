import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ScheduledJob from '@/models/ScheduledJob'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    // Basic validation
    if (!body.client_name || !body.job_name || !body.scheduled_datetime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    /**
     * IMPORTANT RULE
     * ----------------
     * Frontend sends IST time (from datetime-local)
     * Backend ALWAYS converts IST → UTC ONCE
     * MongoDB stores ONLY UTC
     */

    // body.scheduled_datetime example: "2026-02-16T12:22"
    const istDate = new Date(body.scheduled_datetime)

    // Convert IST → UTC (subtract 5 hours 30 minutes)
    const scheduledUTC = new Date(
      istDate.getTime() - (5.5 * 60 * 60 * 1000)
    )

    const job = await ScheduledJob.create({
      client_name: body.client_name,
      job_name: body.job_name,
      job_type: body.job_type || 'post',
      job_json: body.job_json,
      job_media_url: body.job_media_url,
      scheduled_datetime: scheduledUTC, // ✅ stored in UTC
      created_datetime: new Date(),     // UTC automatically
      job_status: 'to_do',
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error('Scheduled Job POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create scheduled job' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    const jobs = await ScheduledJob.find().sort({ scheduled_datetime: 1 })
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Scheduled Job GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scheduled jobs' },
      { status: 500 }
    )
  }
}
