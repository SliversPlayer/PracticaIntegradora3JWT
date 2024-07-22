import mongoose from 'mongoose';

const messageCollection = "messages"

const messageSchema = new mongoose.Schema({
    user: {type: String, ref: 'User', required: true},
    message: {type: String, required: true},
    timestamp: { type: Date, default: Date.now }
});

const messageModel = mongoose.model(messageCollection, messageSchema)

export default messageModel