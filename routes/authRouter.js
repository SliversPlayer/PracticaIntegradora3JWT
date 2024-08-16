import express from 'express';
import usersModel from '../models/user.model.js';
import authMiddleware from '../middleware/authMiddleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// Cargar variables de entorno
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const authRouter = express.Router();
// Ruta para el login de usuarios
authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', session: false }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" });
    try {
        // Verificar los datos en req.user
        console.log('User in req.user:', req.user);
        // Generar el token JWT
        const token = jwt.sign({
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
        }, JWT_SECRET, { expiresIn: '1h' });
        // Imprimir el token y los datos del usuario por consola
        console.log('Generated Token:', token);
        console.log('User Data:', {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
        });
        // Almacenar el token en una cookie y redirigir a la vista de perfil
        res.cookie('authToken', token, { httpOnly: true }).redirect('/current');
    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
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
    res.send({ error: "Login fallido" });
});
// Ruta protegida para obtener el perfil del usuario
authRouter.get('/current', authMiddleware, async (req, res) => {
    try {
        const user = await usersModel.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }
        res.render('current', { user });
    } catch (error) {
        console.error('Error en el servidor:', error); // Log para depuración
        res.status(500).send({ error: 'Error en el servidor' });
    }
});

export default authRouter;


// import express from 'express';
// import passport from 'passport';
// import { generateAuthToken } from '../services/authService.js';
// import authMiddleware from '../middleware/authMiddleware.js';

// const authRouter = express.Router();

// authRouter.post('/login', (req, res, next) => {
//     passport.authenticate('login', (err, user, info) => {
//         if (err || !user) {
//             return res.status(400).json({ message: 'Error de autenticación' });
//         }
//         const token = generateAuthToken(user);
//         res.cookie('authToken', token, { httpOnly: true });
//         res.json({ token });
//     })(req, res, next);
// });

// authRouter.get('/current', authMiddleware, async (req, res) => {
//     try {
//         const user = await usersModel.findById(req.user._id).select('-password');
//         if (!user) {
//             return res.status(404).send({ error: 'Usuario no encontrado' });
//         }
//         res.render('current', { user });
//     } catch (error) {
//         res.status(500).send({ error: 'Error en el servidor' });
//     }
// });

// export default authRouter;

