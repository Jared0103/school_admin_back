const bcrypt = require('bcrypt');
const { createStudent, findStudentByEmail, getAllStudents, updateStudent, deleteStudent } = require('../services/studentService');

exports.addStudent = async (req, res) => {
    try {
        const { fullName, email, className, gender, password, phoneNumber } = req.body;

        if (!fullName || !email || !className || !gender || !password || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingStudent = await findStudentByEmail(email);
        if (existingStudent.success) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = {
            fullName, email, className, gender, password: hashedPassword, phoneNumber, id: `${Date.now()}-${email}`
        };

        const studentResult = await createStudent(newStudent);
        if (studentResult.success) {
            res.status(201).json({ message: 'Student added successfully' });
        } else {
            res.status(500).json({ message: 'Error adding student' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await getAllStudents()
        res.status(200).json({
            message: 'Success',
            students
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error Getting All Students',
            error: error.message
        })
    }
}

exports.updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const studentData = req.body;
        await updateStudent(studentId, studentData);
        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        await deleteStudent(studentId);
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
};
