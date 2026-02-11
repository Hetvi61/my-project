import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ScheduledJob from '@/models/ScheduledJob'
import PastJob from '@/models/PastJob'

export async function POST() {
  try {
    await connectDB()
    const now = new Date()

    const jobs = await ScheduledJob.find({
      scheduled_datetime: { $lte: now },
      job_status: 'to_do',
    })

    for (const job of jobs) {
      try {
        // 🔹 Job execution logic will come later (WhatsApp, etc.)

        // ✅ MOVE TO PAST JOBS
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
        // ❌ FAILURE CASE
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

    return NextResponse.json({
      success: true,
      processed: jobs.length,
    })
  } catch (error) {
    console.error('Runner error:', error)
    return NextResponse.json(
      { error: 'Runner failed' },
      { status: 500 }
    )
  }
}

// 🔹 ADD THIS (VERY IMPORTANT)

