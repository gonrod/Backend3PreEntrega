class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.user = ticket.user;
        this.products = ticket.products.map(p => ({
            product: {
                _id: p.product._id,
                title: p.product.title || "Desconocido",
                price: p.product.price || 0
            },
            quantity: p.quantity
        }));
        this.totalAmount = ticket.totalAmount;
        this.purchaseDate = ticket.purchaseDate;
    }
}

module.exports = TicketDTO;
