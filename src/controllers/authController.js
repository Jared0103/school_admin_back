const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { createUser, findUserByEmail, getAllUsers, deleteUser, updateUser } = require('../services/userService')
const { response } = require('express')

exports.signup = async (req, res) => {
    try {
        const { email, password, id, nombre, apellidoPaterno, apellidoMaterno, telefono, direccion, cPostal, estado } = req.body;
        const existingUser = await findUserByEmail(email);
        
        if (existingUser.success) {
            return res.status(400).json({
                message: 'El usuario ya está registrado'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            email: email,
            password: hashedPassword,
            id: id,
            nombre: nombre,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            telefono: telefono,
            direccion: direccion,
            cPostal: cPostal,
            estado: estado
        };

        const userResult = await createUser(newUser);
        if (userResult.success) {
            res.status(201).json({
                message: 'Usuario registrado satisfactoriamente'
            });
        } else {
            res.status(500).json({
                message: 'Error al registrar usuario'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


exports.login = async (req, res) => {
    try {
        // Codigo para loggearnos
        const { email, password } = req.body
        const findEmail = await findUserByEmail(email)

        if (!findEmail.success) {
            return res.status(401).json({
                message: 'Usuario no encontrado'
            })
        }
        const user = findEmail.user
        const findPassword = await bcrypt.compare(password, user.password)

        if (!findPassword) {
            return res.status(401).json({
                message: 'Password incorrecto'
            })
        }

        const token = jsonwebtoken.sign({
            email: user.email,
            userId: user.id
        }, process.env.TOP_SECRET, {
            expiresIn: '1h'
        })

        res.status(200).json({
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers()
        res.status(200).json({
            message: 'Success',
            users
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error Getting All Users',
            error: error.message
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const userData = req.body
        await updateUser(userId, userData)
        res.status(200).json({
            message: 'User update successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user',
            error: error.menssage
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        await deleteUser(userId)
        res.status(200).json({
            message: 'User deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error: error.menssage
        })
    }
}