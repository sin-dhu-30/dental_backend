const express = require("express")
const router = express.Router()
// Fix: Change from '../controllers/AppointmentController' to '../Controllers/AppointmentController'
const appointmentController = require("../controllers/AppointmentController")

// Your existing routes
router.get("/", appointmentController.getAllAppointments)
router.get("/:id", appointmentController.getAppointmentById)
router.post("/", appointmentController.createAppointment)
router.put("/:id", appointmentController.updateAppointment)
router.delete("/:id", appointmentController.deleteAppointment)

// Additional routes you might have
router.get("/user/:userId", appointmentController.getAppointmentsByUser)
router.patch("/:id/status", appointmentController.updateAppointmentStatus)

module.exports = router
