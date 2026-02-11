import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, 
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    contact: {
      type: String, // string is better for phone numbers
      required: true,
      unique: true,
    },

    password: {
      type: String, // encrypted password
      required: true,
    },

    passwordLength: {
      type: Number, // used only to show dots in UI
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
)

export default mongoose.models.User ||
  mongoose.model('User', UserSchema)
