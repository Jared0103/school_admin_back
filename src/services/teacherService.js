const teacherCollection = require('../models/teacherModel');

exports.createTeacher = async (teacherData) => {
    try {
        await teacherCollection.doc(teacherData.id).set(teacherData);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

exports.findTeacherByEmail = async (email) => {
    try {
        const teacherEmail = await teacherCollection.where('email', '==', email).get();
        if (!teacherEmail.empty) {
            const teacherFound = teacherEmail.docs[0];
            return { success: true, teacher: teacherFound.data() };
        } else {
            return { success: false, error: 'Teacher not found' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

exports.getAllTeachers = async () => {
    try {
        const allTeachers = await teacherCollection.get();
        const teachers = [];
        allTeachers.forEach((doc) => {
            teachers.push(doc.data());
        });
        return teachers;
    } catch (error) {
        throw new Error('Error getting teachers: ' + error.message);
    }
};

exports.updateTeacher = async (teacherId, teacherData) => {
    try {
        await teacherCollection.doc(teacherId).update(teacherData);
    } catch (error) {
        throw new Error('Error updating teacher: ' + error.message);
    }
};

exports.deleteTeacher = async (teacherId) => {
    try {
        await teacherCollection.doc(teacherId).delete();
    } catch (error) {
        throw new Error('Error deleting teacher: ' + error.message);
    }
};
