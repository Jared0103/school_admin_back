const firebase = require('../config/firebase');
const studentCollection = firebase.firestore().collection('students');

module.exports = studentCollection;
