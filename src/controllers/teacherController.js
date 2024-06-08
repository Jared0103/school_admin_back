const bcrypt = require('bcrypt');
const { findTeacherByEmail, getAllTeachers, updateTeacher, deleteTeacher} = require('../services/teacherService');
const firebase = require('../config/firebase');
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

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

exports.exportAllTeachersToCSV = async (req, res) => {
    try {
        const teachers = await getAllTeachers();

        const csvData = [];
        
        // Iterar sobre cada profesor y agregar sus datos al arreglo csvData
        teachers.forEach(teacher => {
            csvData.push({
                id: teacher.id,
                fullName: teacher.fullName,
                email: teacher.email,
                className: teacher.className,
                gender: teacher.gender,
                phoneNumber: teacher.phoneNumber,
                subject: teacher.subject
            });
        });

        // Definir el nombre del archivo y la ruta donde se guardará
        const fileName = 'teachers.csv';
        const filePath = `./${fileName}`;

        // Crear el archivo CSV y escribir la cabecera
        fs.writeFileSync(filePath, '');
        fs.appendFileSync(filePath, `${Object.keys(csvData[0]).join(',')}\n`);
        
        // Escribir los datos de los profesores en el archivo CSV
        csvData.forEach(teacher => {
            fs.appendFileSync(filePath, `${Object.values(teacher).join(',')}\n`);
        });

        // Configurar los encabezados de la respuesta para indicar al navegador que debe descargar el archivo
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'text/csv');

        // Enviar el archivo CSV como respuesta
        res.download(filePath, fileName);
    } catch (error) {
        // Si ocurre algún error, registrarlo y enviar una respuesta de error
        console.error('Error al exportar profesores a CSV:', error);
        res.status(500).json({ success: false, message: 'Error al exportar profesores a CSV' });
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
};

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