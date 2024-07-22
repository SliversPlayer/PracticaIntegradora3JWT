import express from 'express';
import messageDAO from '../dao/message.dao.js';

const router = express.Router();

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
