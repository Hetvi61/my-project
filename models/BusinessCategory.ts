import mongoose from 'mongoose'

const BusinessCategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: Number,
      required: true,
      unique: true, // 🔑 ensures no duplicates
    },
     
    
    name: {
      type: String,
      required: true,
      unique: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessCategory',
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.models.BusinessCategory ||
  mongoose.model('BusinessCategory', BusinessCategorySchema)
