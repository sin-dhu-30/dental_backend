const Appointment = require("../models/AppointmentModel")

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 })

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    res.json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Create appointment
const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body)

    res.status(201).json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    res.json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Get appointments by user (if you have this functionality)
const getAppointmentsByUser = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId }).sort({ date: 1 })

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    res.json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

// Export all functions
module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUser,
  updateAppointmentStatus,
}
