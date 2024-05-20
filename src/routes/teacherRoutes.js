const express = require('express');
const router = express.Router();
const { addTeacher, getAllTeachers, updateTeacher, deleteTeacher } = require('../controllers/teacherController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/addTeacher', verifyToken,  addTeacher);
router.get('/getAllTeachers', verifyToken, getAllTeachers);
router.put('/updateTeacher/:id', verifyToken, updateTeacher);
router.delete('/deleteTeacher/:id', verifyToken, deleteTeacher);

module.exports = router;
