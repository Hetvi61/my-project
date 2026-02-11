const mongoose = require('mongoose')

const ClientsSchema = new mongoose.Schema(
  
    {
    clientId: {
      type: String,
      required: true,
      unique: true, // MUST MATCH DB INDEX
    },
    clientName: String,
    email: String,
    phone: String,
    mobile: String,
    businessCategory: String,
    clientGroup: String,
    targetAudience: String,
    website: String,
    services: String,
    demographics: String,
    productDetails: String,
  },
  { timestamps: true }
)

module.exports =
  mongoose.models.Clients ||
  mongoose.model('Client', ClientsSchema)

  
