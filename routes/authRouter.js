import express from 'express';
import usersModel from '../models/user.model.js';
import authMiddleware from '../middleware/authMiddleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno.');
}

const authRouter = express.Router();

// Ruta para el login de usuarios
authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ status: "error", error: "Datos incompletos" });
        }

        // Generar el token JWT
        const token = jwt.sign({
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
        }, JWT_SECRET, { expiresIn: '1h' });

        // Almacenar el token en una cookie y redirigir a la vista de perfil
        res.cookie('authToken', token, { httpOnly: true });

        // Redirige a current
        res.redirect('/current');

    } catch (err) {
        console.error('Error en /login:', err);
        res.status(500).send('Error al iniciar sesión');
    }
});

// Ruta para obtener el perfil del usuario

authRouter.get('/current', authMiddleware, async (req, res) => {
    try {
        // Buscar al usuario por email en lugar de por ID
        const user = await usersModel.findOne({ email: req.user.email }).select('-password');
        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }
        console.log('User object:', user); // Verifica el objeto `user` aquí
        const userData = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
        };
        res.render('current', { user:userData });
    } catch (error) {
        console.error('Error en /current:', error);
        res.status(500).send({ error: 'Error en el servidor' });
    }
});

// Ruta para el registro de usuarios
authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', session: false }), async (req, res) => {
    res.send({ status: "success", message: "Usuario Registrado" });
});

// Ruta para manejar fallo en registro
authRouter.get('/failregister', (req, res) => {
    console.log("Estrategia de registro fallida");
    res.send({ error: "Registro fallido" });
});

// Ruta para manejar fallo en login
authRouter.get('/faillogin', (req, res) => {
    console.log("Estrategia de login fallida");
    res.send({ error: "Login fallido" });
});

// Ruta para cerrar sesión
authRouter.post('/logout', (req, res) => {
    // Limpiar la cookie authToken
    res.clearCookie('authToken');

    // Redirigir al login
    res.redirect('/login');
});

export default authRouter;