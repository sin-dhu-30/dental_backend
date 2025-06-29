// Main API handler for Vercel - imports your existing routes
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

// Import your existing routes
const userRoutes = require("../routes/UserRoute")
const appointmentRoutes = require("../routes/AppointmentRoute")

const app = express()

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
)

// MongoDB connection with serverless optimization
let isConnected = false

const connectToDatabase = async () => {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
    })
    isConnected = true
    console.log("Connected to MongoDB Atlas")
  } catch (error) {
    console.error("Database connection error:", error)
    throw error
  }
}

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectToDatabase()
    next()
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" })
  }
})

// Health check routes
app.get("/api", (req, res) => {
  res.json({
    message: "Dental Backend API is running on Vercel!",
    endpoints: {
      users: "/api/users",
      appointments: "/api/appointments",
      health: "/api/health",
    },
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Connected to MongoDB Atlas",
    timestamp: new Date().toISOString(),
  })
})

// Use your existing routes
app.use("/api/users", userRoutes)
app.use("/api/appointments", appointmentRoutes)

// Export for Vercel
module.exports = app
