import mongoose, { Schema, models } from 'mongoose'

const ClientPaletteSchema = new Schema(
  {
    clientId: { type: String, required: true },   // From Client table
    clientName: { type: String, required: true }, // For showing in table

    paletteName: { type: String, required: true },

    allColors: { type: String }, // "#ff0000,#000000,#ffffff"

    colors: [{ type: String, required: true }],  // ['#ff0000', '#000000']

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default models.ClientPalette ||
  mongoose.model('ClientPalette', ClientPaletteSchema)
