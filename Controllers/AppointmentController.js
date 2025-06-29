const Appointment = require("../models/AppointmentModel.js")

// Create new appointment
const createAppointment = async (req, res) => {
  const { name, email, phone, date, time, service, existingCustomer, reason } = req.body

  // Validation
  if (!name || !email || !phone || !date || !time || !service || !existingCustomer || !reason) {
    return res.status(400).json({ message: "All fields are required." })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." })
  }

  // Validate phone number (basic validation)
  const phoneRegex = /^[\d\s\-+()]+$/
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Please provide a valid phone number." })
  }

  // Validate date is not in the past
  const appointmentDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (appointmentDate < today) {
    return res.status(400).json({ message: "Appointment date cannot be in the past." })
  }

  try {
    // Check if appointment slot is already taken
    const existingAppointment = await Appointment.findOne({
      date: appointmentDate,
      time: time,
      status: { $ne: "cancelled" },
    })

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked. Please choose a different time.",
      })
    }

    const newAppointment = new Appointment({
      name,
      email,
      phone,
      date: appointmentDate,
      time,
      service,
      existingCustomer,
      reason,
    })

    await newAppointment.save()

    res.status(201).json({
      message: "Appointment booked successfully!",
      appointment: {
        id: newAppointment._id,
        name: newAppointment.name,
        email: newAppointment.email,
        date: newAppointment.date,
        time: newAppointment.time,
        service: newAppointment.service,
        status: newAppointment.status,
      },
    })
  } catch (error) {
    console.error("Appointment booking error:", error)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

// Get all appointments (for admin) - WITH DEBUGGING
const getAllAppointments = async (req, res) => {
  try {
    console.log("Getting all appointments...") // Debug log
    const appointments = await Appointment.find().sort({ date: 1, createdAt: -1 })
    console.log("Found appointments:", appointments.length) // Debug log
    console.log("Appointments data:", appointments) // Debug log

    res.status(200).json(appointments)
  } catch (error) {
    console.error("Get appointments error:", error)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." })
    }
    res.status(200).json({
      message: "Appointment retrieved successfully",
      appointment,
    })
  } catch (error) {
    console.error("Get appointment error:", error)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body
  const validStatuses = ["pending", "confirmed", "cancelled", "completed"]

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status." })
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true })

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." })
    }

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    })
  } catch (error) {
    console.error("Update appointment error:", error)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." })
    }

    res.status(200).json({
      message: "Appointment deleted successfully",
    })
  } catch (error) {
    console.error("Delete appointment error:", error)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
}
