const User = require("../models/UserModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }
    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Create user
const createUser = async (req, res) => {
  try {
    const { password, ...userData } = req.body

    // Hash password if provided
    let hashedPassword
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12)
    }

    const user = await User.create({
      ...userData,
      password: hashedPassword || password,
    })

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json({
      success: true,
      data: userResponse,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      })
    }
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }
    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Register user
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    })

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Export all functions
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
}
