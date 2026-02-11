import mongoose, { Schema, models } from 'mongoose'

const ClientProductCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    parentId: {
      type: String, // self reference (_id as string)
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default models.ClientProductCategory ||
  mongoose.model('ClientProductCategory', ClientProductCategorySchema)
