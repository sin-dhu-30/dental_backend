const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// MongoDB connection
let isConnected = false

const connectDB = async () => {
  if (isConnected) return

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    isConnected = true
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

// Connect to DB middleware
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" })
  }
})

// Basic routes
app.get("/", (req, res) => {
  res.json({
    message: "Dental Backend API is working on Vercel! 🦷",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      appointments: "/api/appointments",
    },
  })
})

app.get("/api", (req, res) => {
  res.json({
    message: "Dental Backend API",
    endpoints: ["/api/health", "/api/users", "/api/appointments"],
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Database connected",
    platform: "Vercel",
    timestamp: new Date().toISOString(),
  })
})

// Import and use your routes
try {
  const userRoutes = require("../routes/UserRoute")
  const appointmentRoutes = require("../routes/AppointmentRoute")

  app.use("/api/users", userRoutes)
  app.use("/api/appointments", appointmentRoutes)
} catch (error) {
  console.error("Error importing routes:", error)
}

module.exports = app
