import mongoose from 'mongoose'

const ClientAddressSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    clientName: { type: String, required: true },

    addressType: {
      type: String,
      enum: ['Office', 'Other'],
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.ClientAddress ||
  mongoose.model('ClientAddress', ClientAddressSchema)
