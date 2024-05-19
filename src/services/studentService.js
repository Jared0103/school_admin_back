const studentCollection = require('../models/studentModel');

exports.createStudent = async (studentData) => {
    try {
        await studentCollection.doc(studentData.id).set(studentData);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

exports.findStudentByEmail = async (email) => {
    try {
        const studentEmail = await studentCollection.where('email', '==', email).get();
        if (!studentEmail.empty) {
            const studentFound = studentEmail.docs[0];
            return { success: true, student: studentFound.data() };
        } else {
            return { success: false, error: 'Student not found' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

exports.getAllStudents = async () => {
    try {
        const allStudents = await studentCollection.get();
        const students = [];
        allStudents.forEach((doc) => {
            students.push(doc.data());
        });
        return students;
    } catch (error) {
        throw new Error('Error getting students: ' + error.message);
    }
};

exports.updateStudent = async (studentId, studentData) => {
    try {
        await studentCollection.doc(studentId).update(studentData);
    } catch (error) {
        throw new Error('Error updating student: ' + error.message);
    }
};

exports.deleteStudent = async (studentId) => {
    try {
        await studentCollection.doc(studentId).delete();
    } catch (error) {
        throw new Error('Error deleting student: ' + error.message);
    }
};
