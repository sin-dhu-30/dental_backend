const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Initialize app
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Add your frontend URLs
    credentials: true,
  }),
)
app.use(express.json())

// Routes
const userRoutes = require("./routes/UserRoute")
const appointmentRoutes = require("./routes/AppointmentRoute")

app.use("/api/users", userRoutes)
app.use("/api/appointments", appointmentRoutes)

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Dental Backend API is running!" })
})

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected")
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err))
