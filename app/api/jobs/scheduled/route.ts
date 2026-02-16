import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ScheduledJob from '@/models/ScheduledJob'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    if (!body.client_name || !body.job_name || !body.scheduled_datetime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let scheduledUTC: Date

    const input = body.scheduled_datetime

    /**
     * If datetime string already contains timezone (Z or +05:30),
     * JavaScript Date will convert it correctly to UTC.
     */
    if (
      typeof input === 'string' &&
      (input.includes('Z') || input.includes('+'))
    ) {
      scheduledUTC = new Date(input)
    } else {
      /**
       * Otherwise assume IST local time → convert to UTC
       */
      const istDate = new Date(input)
      scheduledUTC = new Date(
        istDate.getTime() - (5.5 * 60 * 60 * 1000)
      )
    }

    const job = await ScheduledJob.create({
      client_name: body.client_name,
      job_name: body.job_name,
      job_type: body.job_type || 'post',
      job_json: body.job_json,
      job_media_url: body.job_media_url,
      scheduled_datetime: scheduledUTC, // ✅ ALWAYS UTC
      created_datetime: new Date(),     // UTC by default
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
