const bcrypt = require('bcrypt');
const { createStudent, findStudentByEmail, getAllStudents, updateStudent, deleteStudent } = require('../services/studentService');
const firebase = require('firebase-admin');
const fs = require('fs');
const path = require('path');

exports.importStudentsFromCSV = async (req, res) => {
    try {
        // Verificar si hay un archivo adjunto en la solicitud
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const filePath = req.file.path; // Ruta del archivo CSV subido por el usuario
        const students = [];

        // Leer el archivo CSV línea por línea y procesar los datos
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', async (row) => {
                // Procesar cada fila del CSV y agregar el estudiante a la lista de estudiantes
                const { fullName, email, className, gender, password, phoneNumber } = row;

                if (!fullName || !email || !className || !gender || !password || !phoneNumber) {
                    console.error('Missing required fields for student:', row);
                    return;
                }

                const existingStudent = await findStudentByEmail(email);
                if (existingStudent.success) {
                    console.error('Student already exists:', email);
                    return;
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

                students.push(newStudent);
            })
            .on('end', async () => {
                // Lógica para agregar los estudiantes al sistema
                const promises = students.map(student => createStudent(student));
                await Promise.all(promises);

                res.status(200).json({ success: true, message: 'Students imported successfully' });
            });
    } catch (error) {
        console.error('Error importing students from CSV:', error);
        res.status(500).json({ success: false, message: 'Error importing students from CSV' });
    }
};

exports.exportAllStudentsToCSV = async (req, res) => {
    try {
        const students = await getAllStudents();
        const csvData = [];
        
        // Iterar sobre cada estudiante y agregar sus datos al arreglo csvData
        students.forEach(student => {
            csvData.push({
                id: student.id,
                fullName: student.fullName,
                email: student.email,
                className: student.className,
                gender: student.gender,
                phoneNumber: student.phoneNumber
            });
        });

        // Definir el nombre del archivo y la ruta donde se guardará
        const fileName = 'students.csv';
        const filePath = `./${fileName}`;

        // Crear el archivo CSV y escribir la cabecera
        fs.writeFileSync(filePath, '');
        fs.appendFileSync(filePath, `${Object.keys(csvData[0]).join(',')}\n`);
        
        // Escribir los datos de los estudiantes en el archivo CSV
        csvData.forEach(student => {
            fs.appendFileSync(filePath, `${Object.values(student).join(',')}\n`);
        });

        // Configurar los encabezados de la respuesta para indicar al navegador que debe descargar el archivo
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'text/csv');

        // Enviar el archivo CSV como respuesta
        res.download(filePath, fileName);
    } catch (error) {
        // Si ocurre algún error, registrarlo y enviar una respuesta de error
        console.error('Error al exportar estudiantes a CSV:', error);
        res.status(500).json({ success: false, message: 'Error al exportar estudiantes a CSV' });
    }
};

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
