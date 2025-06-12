import Signup from '../../dental/src/pages/Signup.jsx';

const User=require('../models/UserModel.js');
const bcrypt=require('bcryptjs'); // for hashing password
const jwt=require('jsonwebtoken'); // for login token

// Signup Controller
export const registerUser = async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Login Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Token creation (optional)
    const token = jwt.sign(
      { id: existingUser._id },
      "your_secret_key", // In real apps, store secret in env variables
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful.", token });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
module.export={
  Signup,
  loginUser
};