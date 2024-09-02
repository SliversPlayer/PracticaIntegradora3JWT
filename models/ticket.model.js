import mongoose from 'mongoose';

const ticketCollection = "Tickets";

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - code
 *         - amount
 *         - purchaser
 *       properties:
 *         code:
 *           type: string
 *           description: El código único del ticket
 *         purchase_datetime:
 *           type: string
 *           format: date-time
 *           description: La fecha y hora de la compra
 *         amount:
 *           type: number
 *           description: El monto total de la compra
 *         purchaser:
 *           type: string
 *           description: El ID del usuario que realizó la compra
 */

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})

ticketSchema.pre('validate', function(next) {
    if (!this.isNew) {
        return next();
    }

    this.code = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    next();
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;