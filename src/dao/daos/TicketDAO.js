const Ticket = require('../models/Ticket');

class TicketDAO {
    async createTicket(ticketData) {
        try {
            const newTicket = new Ticket(ticketData);
            return await newTicket.save();
        } catch (error) {
            console.error("Error creando ticket:", error);
            throw error;
        }
    }

    async getTicketById(ticketId) {
        try {
            return await Ticket.findById(ticketId).populate('user').populate('products.product');
        } catch (error) {
            console.error("Error obteniendo ticket:", error);
            throw error;
        }
    }

    async getAllTickets() {
        try {
            return await Ticket.find().populate('user').populate('products.product');
        } catch (error) {
            console.error("Error obteniendo tickets:", error);
            throw error;
        }
    }
}

module.exports = new TicketDAO();
