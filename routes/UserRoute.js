const express = require("express")
const { registerUser, loginUser } = require("../Controllers/UserController")

const router = express.Router()

// Route for signup
router.post("/signup", registerUser)

// Route for login
router.post("/login", loginUser)

module.exports = router
