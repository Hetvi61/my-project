import mongoose, { Schema, models } from 'mongoose'

const ScheduledJobSchema = new Schema({
  // ✅ CLIENT NAME INSTEAD OF CLIENT ID
  client_name: {
    type: String,
    required: true,
  },

  job_name: {
    type: String,
    required: true,
  },

  job_type: {
    type: String,
    enum: ['post', 'video'],
    required: true,
  },

  job_json: {
    type: Schema.Types.Mixed,
  },

  job_media_url: {
    type: String,
  },

  job_status: {
    type: String,
    enum: ['to_do', 'in_progress'],
    default: 'to_do',
  },

  created_datetime: {
    type: Date,
    required: true,
  },

  scheduled_datetime: {
    type: Date,
    required: true,
  },
})

export default models.ScheduledJob ||
  mongoose.model('ScheduledJob', ScheduledJobSchema)
