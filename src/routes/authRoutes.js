const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/get-allusers', authMiddleware, authController.getAllUsers)
router.delete('/delete-user/:id', authMiddleware, authController.deleteUser)
router.put('/update-user/:id', authMiddleware, authController.updateUser)

module.exports = router