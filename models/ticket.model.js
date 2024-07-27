import mongoose from 'mongoose';

const ticketCollection = "Tickets";

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