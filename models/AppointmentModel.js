const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      enum: ["morning", "evening"],
    },
    service: {
      type: String,
      required: true,
      enum: ["teeth_cleaning", "root_canal", "braces", "cavity_filling", "whitening"],
    },
    existingCustomer: {
      type: String,
      required: true,
      enum: ["yes", "no"],
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "cancelled", "completed"],
    },
  },
  {
    timestamps: true,
  },
)

// Prevent model re-compilation in serverless environment
const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema)

module.exports = Appointment
