import mongoose from 'mongoose';

const messageCollection = "messages"

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - user
 *         - message
 *       properties:
 *         user:
 *           type: string
 *           description: El ID del usuario que envía el mensaje
 *         message:
 *           type: string
 *           description: El contenido del mensaje
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: La fecha y hora en que se envió el mensaje
 */

const messageSchema = new mongoose.Schema({
    user: {type: String, ref: 'User', required: true},
    message: {type: String, required: true},
    timestamp: { type: Date, default: Date.now }
});

const messageModel = mongoose.model(messageCollection, messageSchema)

export default messageModel