const express = require('express');
const router = express.Router();
const cors = require('cors');
const { signup, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
