import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/sessions.controller.js';

const router = Router();

// Ruta para el login
router.post('/login', loginUser);

// Ruta para el registro
router.post('/register', registerUser);

export default router;
