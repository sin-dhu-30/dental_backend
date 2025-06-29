const User = require("../models/UserModel.js")
const bcrypt = require("bcryptjs") // for hashing password
const jwt = require("jsonwebtoken") // for login token

// Signup Controller
const registerUser = async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body

  // Validation
  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    // Create token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET || "your_secret_key", {
      expiresIn: "7d",
    })

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

// Login Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(400).json({ message: "User not found." })
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." })
    }

    // Token creation
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7d" },
    )

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
}
