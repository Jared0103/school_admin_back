const firebase = require('../config/firebase');
const userCollection = firebase.firestore().collection('users');

exports.createUser = async (userData) => {
    try {
        const newUserRef = userCollection.doc();
        const newUserData = { id: newUserRef.id, ...userData };
        await newUserRef.set(newUserData);
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

exports.findUserById = async (userId) => {
    try {
        const userFound = await userCollection.doc(userId).get();
        if (userFound.exists) {
            return { success: true, user: userFound.data() };
        } else {
            return { success: false, error: 'Usuario no encontrado' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

exports.findUserByEmail = async (email) => {
    try {
        const userEmail = await userCollection.where('schoolMail', '==', email).get();
        if (!userEmail.empty) {
            const userFound = userEmail.docs[0];
            return { success: true, user: userFound.data() };
        } else {
            return { success: false, error: 'Usuario no encontrado' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

exports.findUserByNameSchool = async (nameSchool) => {
    try {
        const userNameSchool = await userCollection.where('nameSchool', '==', nameSchool).get();
        if (!userNameSchool.empty) {
            const userFound = userNameSchool.docs[0];
            return { success: true, user: userFound.data() };
        } else {
            return { success: false, error: 'Usuario no encontrado' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

exports.getAllUsers = async () => {
    try {
        const allUsers = await userCollection.get();
        const users = allUsers.docs.map(doc => doc.data());
        return users;
    } catch (error) {
        throw new Error('Error obteniendo usuarios: ' + error.message);
    }
};

exports.deleteUser = async (userId) => {
    try {
        await userCollection.doc(userId).delete();
    } catch (error) {
        throw new Error('Error eliminando usuario: ' + error.message);
    }
};

exports.updateUser = async (userId, userData) => {
    try {
        await userCollection.doc(userId).update(userData);
    } catch (error) {
        throw new Error('Error actualizando usuario: ' + error.message);
    }
};
