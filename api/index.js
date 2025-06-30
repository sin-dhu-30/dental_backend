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
  }
}

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Dental Backend API is working!" })
})

app.get("/api", (req, res) => {
  res.json({ message: "API endpoint working!" })
})

app.get("/api/health", async (req, res) => {
  try {
    await connectDB()
    res.json({ status: "OK", message: "Database connected" })
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message })
  }
})

// Test route without importing other files first
app.get("/api/test", (req, res) => {
  res.json({ message: "Test route working", timestamp: new Date() })
})

// Export for Vercel
module.exports = app
