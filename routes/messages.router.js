import express from 'express';
import messageDAO from '../dao/message.dao.js';

const router = express.Router();

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Obtener todos los mensajes
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Lista de mensajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: string
 *                   message:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Enviar un mensaje
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensaje enviado
 *       500:
 *         description: Error interno del servidor
 */

// Ruta para obtener todos los mensajes
router.get('/', async (req, res) => {
    try {
        const messages = await messageDAO.getAll();
        res.render("chat", { messages });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para enviar un mensaje
router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body;
        await messageDAO.create({ user, message });
        res.redirect('/api/messages');
        //res.status(201).json(newMessage);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
