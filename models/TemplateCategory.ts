import mongoose from 'mongoose'

const TemplateCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TemplateCategory',
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.models.TemplateCategory ||
  mongoose.model('TemplateCategory', TemplateCategorySchema)

