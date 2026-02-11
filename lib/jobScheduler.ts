import cron from 'node-cron'
import { connectDB } from '@/lib/mongodb'
import ScheduledJob from '@/models/ScheduledJob'
import PastJob from '@/models/PastJob'

let isStarted = false

export function startJobScheduler() {
  if (isStarted) return
  isStarted = true

  console.log('🟢 Job scheduler started')

  // runs every 1 minute
  cron.schedule('* * * * *', async () => {
    try {
      await connectDB()
      const now = new Date()

      const jobs = await ScheduledJob.find({
        scheduled_datetime: { $lte: now },
        job_status: 'to_do',
      })

      for (const job of jobs) {
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
      }

    } catch (err) {
      console.error('Scheduler error:', err)
    }
  })
}
