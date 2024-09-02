import express from 'express';
import { sendPasswordResetEmail, resetPassword } from '../services/passwordResetService.js';

const router = express.Router();

/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     summary: Enviar correo de recuperación de contraseña
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado
 *       400:
 *         description: Error en la solicitud
 */

/**
 * @swagger
 * /api/reset-password/{token}:
 *   post:
 *     summary: Restablecer la contraseña
 *     tags: [Password Reset]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de restablecimiento de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña
 *     responses:
 *       200:
 *         description: Contraseña restablecida correctamente
 *       400:
 *         description: Error en la solicitud
 */

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