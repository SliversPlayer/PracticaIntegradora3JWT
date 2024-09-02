import express from 'express';
import { sendPasswordResetEmail, resetPassword } from '../services/passwordResetService.js';

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
    try {
        await sendPasswordResetEmail(req.body.email);
        res.status(200).send('Correo de recuperación enviado');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        await resetPassword(req.params.token, req.body.newPassword);
        res.status(200).send('Contraseña restablecida correctamente');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

export default router;