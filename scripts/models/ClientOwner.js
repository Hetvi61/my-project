const mongoose = require('mongoose')

const ClientOwnerSchema = new mongoose.Schema(
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

    ownerName: {
      type: String,
      required: true,
    },
    email: String,
    mobile: String,
  },
  { timestamps: true }
)

module.exports =
  mongoose.models.ClientOwner ||
  mongoose.model('ClientOwner', ClientOwnerSchema)
