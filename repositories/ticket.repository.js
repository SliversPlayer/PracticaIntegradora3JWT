import Ticket from "../models/ticket.model.js";

class TicketRepository {
    async createTicket(ticketData) {
        const ticket = new Ticket(ticketData);
        return await ticket.save();
    }

    async getTicketById(id) {
        return await Ticket.findById(id);
    }

    async getAllTickets() {
        return await Ticket.find();
    }

    async updateTicket(id, ticketData) {
        return await Ticket.findByIdAndUpdate(id, ticketData, { new: true });
    }

    async deleteTicket(id) {
        return await Ticket.findByIdAndDelete(id);
    }
}

export default TicketRepository;