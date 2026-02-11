import mongoose, { Schema, models } from 'mongoose'

const PastJobSchema = new Schema({
  // ✅ CLIENT NAME ONLY (NO CLIENT ID)
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
    enum: ['delivered', 'failed'],
    required: true,
  },

  created_datetime: {
    type: Date,
    required: true,
  },

  delivered_datetime: {
    type: Date,
    required: true,
  },
})

export default models.PastJob ||
  mongoose.model('PastJob', PastJobSchema)

