const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/addStudent', authMiddleware, studentController.addStudent);
router.get('/getAllStudents', authMiddleware, studentController.getAllStudents);
router.put('/updateStudent/:id', authMiddleware, studentController.updateStudent);
router.delete('/deleteStudent/:id', authMiddleware, studentController.deleteStudent);
router.get('/exportAllStudentsToCSV', authMiddleware, studentController.exportAllStudentsToCSV);
router.post('/importStudentsFromCSV', authMiddleware, studentController.importStudentsFromCSV);

module.exports = router;
