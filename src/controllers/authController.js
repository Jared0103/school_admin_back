const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserByNameSchool, getAllUsers, deleteUser, updateUser } = require('../models/userModel');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { nameAdmin, nameSchool, schoolMail, password, numberOfStaff, schoolAddress } = req.body;

        if (!nameAdmin || !nameSchool || !schoolMail || !password || !numberOfStaff || !schoolAddress) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await findUserByEmail(schoolMail);

        if (existingUser.success) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            nameAdmin, nameSchool, schoolMail, password: hashedPassword, numberOfStaff, schoolAddress
        };

        const userResult = await createUser(newUser);
        if (userResult.success) {
            res.status(201).json({ message: 'User registered successfully' });
        } else {
            res.status(500).json({ message: 'Error registering user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { nameSchool, password } = req.body;

        if (!nameSchool || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await findUserByNameSchool(nameSchool);

        if (!existingUser.success) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const user = existingUser.user;
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, nameSchool: user.nameSchool }, process.env.TOP_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
