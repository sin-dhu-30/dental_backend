const express = require("express")
const router = express.Router()
// Fix: Change from '../controllers/UserController' to '../Controllers/UserController'
const userController = require("../controllers/UserController")

// Your existing routes
router.get("/", userController.getAllUsers)
router.get("/:id", userController.getUserById)
router.post("/", userController.createUser)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)

// If you have authentication routes
router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)

module.exports = router
