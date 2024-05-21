const bcrypt = require('bcrypt');
const { createStudent, findStudentByEmail, getAllStudents, updateStudent, deleteStudent } = require('../services/studentService');
const firebase = require('firebase-admin');

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

        // Obtener el último ID generado
        const idDocRef = firebase.firestore().collection('config').doc('studentId');
        const idDoc = await idDocRef.get();
        
        let newId;
        if (idDoc.exists) {
            const lastId = idDoc.data().lastId;
            newId = (parseInt(lastId, 16) + 1).toString(16); // Incrementar y convertir a hexadecimal
        } else {
            newId = '1'; // Iniciar con '1' en hexadecimal si no hay ningún ID previo
        }

        // Actualizar el último ID en la colección de configuración
        await idDocRef.set({ lastId: newId });

        const newStudent = {
            id: newId,
            fullName,
            email,
            className,
            gender,
            password: hashedPassword,
            phoneNumber
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
