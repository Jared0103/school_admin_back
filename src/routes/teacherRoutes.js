const express = require('express');
const router = express.Router();
const cors = require('cors');
const { addTeacher, getAllTeachers, updateTeacher, deleteTeacher } = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/addTeacher', authMiddleware, addTeacher);
router.get('/getAllTeachers', authMiddleware, getAllTeachers);
router.put('/updateTeacher/:id', authMiddleware, updateTeacher);
router.delete('/deleteTeacher/:id', authMiddleware, deleteTeacher);

module.exports = router;
