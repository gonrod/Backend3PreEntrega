const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },  // Código único del ticket
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usuario que hizo la compra
    products: [{ 
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }], // Productos comprados y cantidades
    totalAmount: { type: Number, required: true }, // Monto total de la compra
    purchaseDate: { type: Date, default: Date.now } // Fecha de compra
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
