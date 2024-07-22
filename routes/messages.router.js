import express from 'express';
import messageModel from '../models/message.model.js';

const router = express.Router();

// Ruta para obtener todos los mensajes
router.get('/', async (req, res) => {
    try {
        const messages = await messageModel.find().sort({ timestamp: -1 }).lean();
        res.render("chat",{messages})
    } catch (error) {
        console.error('Error al obtener mensajes de la base de datos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para enviar un mensaje
router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = new messageModel({ user, message });
        await newMessage.save();
        res.redirect('/api/messages');
        //res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error al guardar el mensaje en la base de datos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;