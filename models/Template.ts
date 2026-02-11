import mongoose from 'mongoose'

const TemplateSchema = new mongoose.Schema(
  {
    templateName: { type: String, required: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TemplateCategory',
      required: true,
    },

    width: Number,
    height: Number,

    templateType: {
      type: String,
      enum: ['Post', 'Video'],
      required: true,
    },

    tags: [String],

    templateUrl: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Template ||
  mongoose.model('Template', TemplateSchema)
