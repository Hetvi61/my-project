const mongoose = require('mongoose')

const ClientAddressSchema = new mongoose.Schema(
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

    addressType: {
      type: String,
      default: 'Office',
    },

    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports =
  mongoose.models.ClientAddress ||
  mongoose.model('ClientAddress', ClientAddressSchema)
