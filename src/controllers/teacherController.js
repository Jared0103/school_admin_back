const bcrypt = require('bcrypt');
const { addTeacher, findTeacherByEmail, getAllTeachers, updateTeacher } = require('../services/teacherService');
const firebase = require('../config/firebase');

exports.addTeacher = async (req, res) => {
    try {
        const { fullName, email, className, gender, password, phoneNumber, subject } = req.body;

        if (!fullName || !email || !className || !gender || !password || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingTeacher = await findTeacherByEmail(email);
        if (existingTeacher.success) {
            return res.status(400).json({ message: 'Teacher already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacherData = {
            fullName,
            email,
            className,
            gender,
            password: hashedPassword,
            phoneNumber,
            subject
        };

        // Guarda el maestro en la colección "teachers" en Firebase
        const teachersCollection = firebase.firestore().collection('teachers');
        await teachersCollection.add(teacherData);

        res.status(201).json({ message: 'Teacher added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding teacher', error: error.message });
    }
};


exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await getAllTeachers();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const teacherData = req.body;
        await updateTeacher(teacherId, teacherData);
        res.status(200).json({ message: 'Teacher updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating teacher', error: error.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        await deleteTeacher(teacherId);
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting teacher', error: error.message });
    }
};
