import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ScheduledJob from '@/models/ScheduledJob'
import PastJob from '@/models/PastJob'

async function runJobs() {
  await connectDB()
  const now = new Date()

  const jobs = await ScheduledJob.find({
    scheduled_datetime: { $lte: now },
    job_status: 'to_do',
  })

  for (const job of jobs) {
    try {
      // 🔹 Job execution logic will come later (WhatsApp, etc.)

      await PastJob.create({
        client_name: job.client_name,
        job_name: job.job_name,
        job_type: job.job_type,
        job_json: job.job_json,
        job_media_url: job.job_media_url,
        job_status: 'delivered',
        created_datetime: job.created_datetime,
        delivered_datetime: new Date(),
      })

      await ScheduledJob.findByIdAndDelete(job._id)

    } catch (err) {
      await PastJob.create({
        client_name: job.client_name,
        job_name: job.job_name,
        job_type: job.job_type,
        job_json: job.job_json,
        job_media_url: job.job_media_url,
        job_status: 'failed',
        created_datetime: job.created_datetime,
        delivered_datetime: new Date(),
      })

      await ScheduledJob.findByIdAndDelete(job._id)
    }
  }

  return jobs.length
}

/* 🔹 FOR VERCEL CRON (AUTO) */
export async function GET() {
  try {
    const processed = await runJobs()
    return NextResponse.json({ success: true, processed })
  } catch (error) {
    console.error('Runner GET error:', error)
    return NextResponse.json({ error: 'Runner failed' }, { status: 500 })
  }
}

/* 🔹 FOR MANUAL RUN (BUTTON / POSTMAN) */
export async function POST() {
  try {
    const processed = await runJobs()
    return NextResponse.json({ success: true, processed })
  } catch (error) {
    console.error('Runner POST error:', error)
    return NextResponse.json({ error: 'Runner failed' }, { status: 500 })
  }
}
