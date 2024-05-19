const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserByNameSchool, getAllUsers, deleteUser, updateUser } = require('../models/userModel');
require('dotenv').config();

exports.createUser = async (userData) => {
    try {
        const createdUser = await createUser(userData);
        console.log("🚀 ~ exports.createUser= ~ createdUser:", createdUser)
        if (createdUser) {
            return {
                success: true
            };
        } else {
            return {
                success: false,
                error: "Error al crear el usuario"
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

exports.findUserByEmail = async (email) => {
    try {
        const found = await findUserByEmail(email);
        if (found) {
            return {
                success: true,
                user: found
            };
        }
        return {
            success: false,
            message: 'Usuario No Encontrado'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

exports.findUserByNameSchool = async (nameSchool) => {
    try {
        const found = await findUserByNameSchool(nameSchool);
        if (found) {
            return {
                success: true,
                user: found
            };
        }
        return {
            success: false,
            message: 'Usuario No Encontrado'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

exports.comparePassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw new Error('Error al comparar password');
    }
};

exports.generateToken = (user) => {
    try {
        return jwt.sign({
            email: user.email,
            userId: user.id
        }, process.env.TOP_SECRET, { expiresIn: '1h' });
    } catch (error) {
        throw new Error('Error al generar el token');
    }
};

exports.getAllUsers = async () => {
    try {
        return await getAllUsers();
    } catch (error) {
        throw new Error('Error Getting Users: ' + error.message);
    }
};

exports.deleteUser = async (userId) => {
    try {
        await deleteUser(userId);
    } catch (error) {
        throw new Error('Error Deleting user: ' + error.message);
    }
};

exports.updateUser = async (userId, userData) => {
    try {
        await updateUser(userId, userData);
    } catch (error) {
        throw new Error('Error Updating user: ' + error.message);
    }
};

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
