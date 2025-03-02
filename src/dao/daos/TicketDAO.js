const Ticket = require('../models/Ticket');
class TicketDAO {
    async createTicket(ticketData) {
        try {
            const newTicket = new Ticket(ticketData);
            return await newTicket.save();
        } catch (error) {
            throw error;
        }
    }

    async getTicketById(ticketId) {
        try {
            return await Ticket.findById(ticketId).populate('user').populate('products.product');
        } catch (error) {
            throw error;
        }
    }

    async getAllTickets() {
        try {
            return await Ticket.find().populate('user').populate('products.product');
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TicketDAO();
