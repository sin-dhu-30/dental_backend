const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

// Import your existing routes
const userRoutes = require("./routes/UserRoute")
const appointmentRoutes = require("./routes/AppointmentRoute")

const app = express()

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-domain.vercel.app", // Replace with your actual frontend URL
      "https://*.vercel.app",
    ],
    credentials: true,
  }),
)

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Dental Backend API is running on Render! 🎨",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      appointments: "/api/appointments",
    },
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Connected to MongoDB Atlas",
    platform: "Render",
    timestamp: new Date().toISOString(),
  })
})

// Use your existing routes
app.use("/api/users", userRoutes)
app.use("/api/appointments", appointmentRoutes)

const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`🎨 Server running on Render port ${PORT}`)
})
