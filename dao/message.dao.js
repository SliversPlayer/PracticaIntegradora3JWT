import messageModel from "../models/message.model.js";

class MessageDAO {
    async getAll() {
        try {
            return await messageModel.find().sort({ timestamp: -1 }).lean();
        } catch (error) {
            throw new Error('Error al obtener mensajes de la base de datos');
        }
    }

    async create(data) {
        try {
            const newMessage = new messageModel(data);
            return await newMessage.save();
        } catch (error) {
            throw new Error('Error al guardar el mensaje en la base de datos');
        }
    }
}

export default new MessageDAO();
