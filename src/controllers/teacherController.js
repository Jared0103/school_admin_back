const bcrypt = require('bcrypt');
const { addTeacher, findTeacherByEmail, getAllTeachers, updateTeacher, deleteTeacher} = require('../services/teacherService');
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

        // Generar un ID único para el nuevo documento del maestro
        const newTeacherRef = firebase.firestore().collection('teachers').doc();

        // Establecer el ID generado en los datos del maestro
        teacherData.id = newTeacherRef.id;

        // Guardar el maestro en la colección "teachers" en Firebase
        await newTeacherRef.set(teacherData);

        res.status(201).json({ message: 'Teacher added successfully', teacherId: newTeacherRef.id });
    } catch (error) {
        res.status(500).json({ message: 'Error adding teacher', error: error.message });
    }
};



exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await getAllTeachers()
        res.status(200).json({
            message: 'Success',
            teachers
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error Getting All Teachers',
            error: error.message
        })
    }
}

exports.updateTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const teacherRef = firebase.firestore().collection('teachers').doc(teacherId);
        const teacherDoc = await teacherRef.get();
        
        if (!teacherDoc.exists) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Si el maestro existe, proceder con la actualización
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