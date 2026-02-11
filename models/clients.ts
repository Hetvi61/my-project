import mongoose from 'mongoose'

const ClientSchema = new mongoose.Schema(
  {


    clientId: {
      type: Number,
      unique: true,
      required: true,
      index: true,
    },
    clientName: { type: String, required: true },

    email: { type: String, required: true, },

    phone: String,
    mobile: String,

    businessCategory: String,

    targetAudience: String,
    website: String,

    services: String,
    productDetails: String,
    demographics: String,
    clientGroup: String,
  },
  { timestamps: true }
)

export default mongoose.models.Client ||
  mongoose.model('Client', ClientSchema)
