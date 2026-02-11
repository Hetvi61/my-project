const mongoose = require('mongoose')

const ClientGroupSchema = new mongoose.Schema(
  {
    groupId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientGroup',
      default: null,
    },
  },
  { timestamps: true }
)

module.exports =
  mongoose.models.ClientGroup ||
  mongoose.model('ClientGroup', ClientGroupSchema)
