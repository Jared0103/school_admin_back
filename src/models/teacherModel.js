const firebase = require('../config/firebase');
const teacherCollection = firebase.firestore().collection('teachers');

module.exports = teacherCollection;
