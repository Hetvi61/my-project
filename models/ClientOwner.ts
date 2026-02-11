import mongoose from 'mongoose'

const ClientOwnerSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },

    // ✅ STORE CLIENT NAME ALSO
    clientName: {
      type: String,
      required: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    email: String,
    mobile: String,
  },
  { timestamps: true }
)

export default mongoose.models.ClientOwner ||
  mongoose.model('ClientOwner', ClientOwnerSchema)

