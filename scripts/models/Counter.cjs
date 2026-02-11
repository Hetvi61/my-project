const mongoose = require('mongoose')

const CounterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
})

// 🔥 VERY IMPORTANT: export the MODEL, not an object
const Counter =
  mongoose.models.Counter ||
  mongoose.model('Counter', CounterSchema)

module.exports = Counter
