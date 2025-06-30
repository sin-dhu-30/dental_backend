const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)

// MongoDB connection
let isConnected = false

const connectDB = async () => {
  if (isConnected) return

  try {
    if (!process.env.MONGO_URI) {
      console.log("MONGO_URI not found, using test mode")
      return
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    })

    isConnected = true
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error.message)
    // Don't throw error, just log it
  }
}

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "🦷 Dental Backend API is working on Vercel!",
    status: "success",
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
  })
})

app.get("/api", (req, res) => {
  res.json({
    message: "Dental Backend API",
    status: "success",
    endpoints: ["/api/health", "/api/users", "/api/appointments"],
  })
})

app.get("/api/health", async (req, res) => {
  try {
    await connectDB()
    res.json({
      status: "OK",
      message: "API is working",
      platform: "Vercel",
      timestamp: new Date().toISOString(),
      mongodb: isConnected ? "Connected" : "Not configured",
      env: {
        nodeVersion: process.version,
        mongoUri: process.env.MONGO_URI ? "Set" : "Not set",
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

app.get("/api/users", async (req, res) => {
  try {
    await connectDB()
    res.json({
      success: true,
      message: "Users endpoint working",
      data: [
        { id: 1, name: "Test User 1", email: "test1@example.com" },
        { id: 2, name: "Test User 2", email: "test2@example.com" },
      ],
      count: 2,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

app.get("/api/appointments", async (req, res) => {
  try {
    await connectDB()
    res.json({
      success: true,
      message: "Appointments endpoint working",
      data: [
        {
          id: 1,
          name: "John Doe",
          date: "2024-01-15",
          time: "morning",
          service: "teeth_cleaning",
        },
      ],
      count: 1,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Handle all other routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.originalUrl,
    method: req.method,
  })
})

// Error handling
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error)
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: error.message,
  })
})

module.exports = app
"// Updated for debugging" 
