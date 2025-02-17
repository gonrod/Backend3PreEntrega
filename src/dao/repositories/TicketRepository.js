const TicketDAO = require('../daos/TicketDAO');
const TicketDTO = require('../../dtos/TicketDTO');

class TicketRepository {
    async createTicket(ticketData) {
        try {
            const newTicket = await TicketDAO.createTicket(ticketData);
            return new TicketDTO(newTicket);
        } catch (error) {
            console.error("❌ Error en TicketRepository al crear ticket:", error);
            throw error;
        }
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await TicketDAO.getTicketById(ticketId);
            if (!ticket) return null;
            return new TicketDTO(ticket);
        } catch (error) {
            console.error("❌ Error en TicketRepository al obtener ticket:", error);
            throw error;
        }
    }

    async getAllTickets() {
        try {
            const tickets = await TicketDAO.getAllTickets();
            return tickets.map(ticket => new TicketDTO(ticket));
        } catch (error) {
            console.error("❌ Error en TicketRepository al obtener todos los tickets:", error);
            throw error;
        }
    }
}

module.exports = new TicketRepository();
