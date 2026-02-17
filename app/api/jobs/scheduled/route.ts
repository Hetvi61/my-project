import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ScheduledJob from '@/models/ScheduledJob'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    // ================= BASIC VALIDATION =================
    if (!body.client_name || !body.job_name || !body.scheduled_datetime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ================= IST → UTC CONVERSION =================
    // Input format from datetime-local: YYYY-MM-DDTHH:mm
    const input: string = body.scheduled_datetime

    const [datePart, timePart] = input.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hour, minute] = timePart.split(':').map(Number)

    // IST = UTC + 5:30 → subtract 5:30
    const scheduledUTC = new Date(
      Date.UTC(year, month - 1, day, hour - 5, minute - 30)
    )

    // ================= WHATSAPP NORMALIZATION =================
    let jobJson = body.job_json || {}

    if (body.job_type === 'whatsapp') {
      if (!body.whatsapp_number || !body.message_text) {
        return NextResponse.json(
          { error: 'WhatsApp number and message required' },
          { status: 400 }
        )
      }

      // Clean phone number
      let phone = body.whatsapp_number.toString().trim()
      phone = phone.replace(/\D/g, '') // remove +, spaces, etc.

      // Add India country code if only 10 digits
      if (phone.length === 10) {
        phone = `91${phone}`
      }

      jobJson = {
        phone,
        message: body.message_text,
      }
    }

    // ================= CREATE JOB =================
    const job = await ScheduledJob.create({
      client_name: body.client_name,
      job_name: body.job_name,
      job_type: body.job_type || 'post',
      job_json: jobJson,
      job_media_url: body.job_media_url || null,
      scheduled_datetime: scheduledUTC, // ✅ UTC only
      created_datetime: new Date(),     // UTC auto
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
