import mongoose from 'mongoose'

const ClientGroupSchema = new mongoose.Schema(
  { 
     groupId: {
      type: Number,
      unique: true,
      required: true,
    },
    
    name: {
      type: String,
      required: true,
      unique: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientGroup',
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.models.ClientGroup ||
  mongoose.model('ClientGroup', ClientGroupSchema)
