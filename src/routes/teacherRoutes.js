const express = require('express');
const router = express.Router();
const cors = require('cors');
const { addTeacher, getAllTeachers, updateTeacher, deleteTeacher, exportAllTeachersToCSV } = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/addTeacher', authMiddleware, addTeacher);
router.get('/getAllTeachers', authMiddleware, getAllTeachers);
router.put('/updateTeacher/:id', authMiddleware, updateTeacher);
router.delete('/deleteTeacher/:id', authMiddleware, deleteTeacher);
router.get('/exportAllTeachersToCSV', authMiddleware, exportAllTeachersToCSV);

module.exports = router;
