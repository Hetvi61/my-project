import mongoose from 'mongoose'

const ClientLogoSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },

    clientName: {
      type: String,
      required: true,
    },

    logoName: {
      type: String,
      required: true,
    },

    logoUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
)

export default mongoose.models.ClientLogo ||
  mongoose.model('ClientLogo', ClientLogoSchema)
