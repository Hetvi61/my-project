import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ScheduledJob from '@/models/ScheduledJob'
import PastJob from '@/models/PastJob'

/* ================= CORE LOGIC ================= */
async function runJobs() {
  await connectDB()
  const now = new Date()

  // 🔹 FETCH ONLY PENDING & DUE JOBS
  const jobs = await ScheduledJob.find({
    scheduled_datetime: { $lte: now },
    job_status: 'to_do',
  })

  for (const job of jobs) {
    try {
      // 🔹 MARK JOB AS IN_PROGRESS (VERY IMPORTANT)
      await ScheduledJob.findByIdAndUpdate(job._id, {
        job_status: 'in_progress',
      })

      // 🔹 FUTURE: WhatsApp / Email / API logic will go here

      // ✅ MOVE TO PAST JOBS (SUCCESS)
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

      // ✅ REMOVE FROM SCHEDULED JOBS
      await ScheduledJob.findByIdAndDelete(job._id)

    } catch (err) {
      console.error('Job failed:', err)

      // ❌ MOVE TO PAST JOBS (FAILED)
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

/* ================= VERCEL CRON (AUTO) ================= */
/* Cron ALWAYS uses GET */
export async function GET() {
  try {
    const processed = await runJobs()
    return NextResponse.json({
      success: true,
      source: 'cron',
      processed,
    })
  } catch (error) {
    console.error('Runner GET error:', error)
    return NextResponse.json(
      { error: 'Runner failed (cron)' },
      { status: 500 }
    )
  }
}

/* ================= MANUAL RUN (BUTTON / POSTMAN) ================= */
export async function POST() {
  try {
    const processed = await runJobs()
    return NextResponse.json({
      success: true,
      source: 'manual',
      processed,
    })
  } catch (error) {
    console.error('Runner POST error:', error)
    return NextResponse.json(
      { error: 'Runner failed (manual)' },
      { status: 500 }
    )
  }
}
