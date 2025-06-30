const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no duplicate emails
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  },
)

// Prevent model re-compilation in serverless environment
const User = mongoose.models.User || mongoose.model("User", userSchema)

module.exports = User
