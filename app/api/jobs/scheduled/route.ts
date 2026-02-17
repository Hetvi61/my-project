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
     * FRONTEND sends IST from <input type="datetime-local">
     * Format: YYYY-MM-DDTHH:mm
     * We MUST manually convert IST → UTC
     */

    const input: string = body.scheduled_datetime

    // Split date & time
    const [datePart, timePart] = input.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hour, minute] = timePart.split(':').map(Number)

    /**
     * IST = UTC + 5:30
     * UTC = IST - 5:30
     */
    const scheduledUTC = new Date(
      Date.UTC(year, month - 1, day, hour - 5, minute - 30)
    )

    const job = await ScheduledJob.create({
      client_name: body.client_name,
      job_name: body.job_name,
      job_type: body.job_type || 'post',
      job_json: body.job_json,
      job_media_url: body.job_media_url,
      scheduled_datetime: scheduledUTC, // ✅ correct UTC
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
