const express = require('express');
const router = express.Router();
const { addStudent, getAllStudents, updateStudent, deleteStudent } = require('../controllers/studentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/addStudent', addStudent);
router.get('/getAllStudents', getAllStudents);
router.put('/updateStudent/:id', verifyToken, updateStudent);
router.delete('/deleteStudent/:id', verifyToken, deleteStudent);

module.exports = router;