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
     * If datetime already has timezone info (Z or +05:30)
     * let JS handle it
     */
    if (
      typeof input === 'string' &&
      (input.includes('Z') || input.includes('+'))
    ) {
      scheduledUTC = new Date(input)
    } else {
      /**
       * Input is IST (from datetime-local)
       * Format: YYYY-MM-DDTHH:mm
       * We must MANUALLY convert IST → UTC
       */

      const [datePart, timePart] = input.split('T')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hour, minute] = timePart.split(':').map(Number)

      // Create UTC date by subtracting IST offset (5:30)
      scheduledUTC = new Date(
        Date.UTC(year, month - 1, day, hour - 5, minute - 30)
      )
    }

    const job = await ScheduledJob.create({
      client_name: body.client_name,
      job_name: body.job_name,
      job_type: body.job_type || 'post',
      job_json: body.job_json,
      job_media_url: body.job_media_url,
      scheduled_datetime: scheduledUTC, // ✅ correct UTC
      created_datetime: new Date(),
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
