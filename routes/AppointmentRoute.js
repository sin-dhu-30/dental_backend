const express = require("express")

// Import all functions from AppointmentController
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/AppointmentController")

const router = express.Router()

// Route for creating new appointment
router.post("/", createAppointment)

// Route for getting all appointments (admin)
router.get("/", getAllAppointments)

// Route for getting appointment by ID
router.get("/:id", getAppointmentById)

// Route for updating appointment status
router.put("/:id/status", updateAppointmentStatus)

// Route for deleting appointment
router.delete("/:id", deleteAppointment)

module.exports = router
