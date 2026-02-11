import mongoose, { Schema, models } from 'mongoose'

const ClientProductSchema = new Schema(
  {
    clientId: {
      type: String,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    category: String,
    angle: String,
    size: String,
    style: String,
    type: String,
    description: String,

    image: String, // image path like logo

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default models.ClientProduct ||
  mongoose.model('ClientProduct', ClientProductSchema)
