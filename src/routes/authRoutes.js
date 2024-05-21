const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware'); // Importa el middleware

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;
