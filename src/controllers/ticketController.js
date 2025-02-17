const TicketDAO = require('../dao/daos/TicketDAO');
const TicketDTO = require('../dtos/TicketDTO');
const { v4: uuidv4 } = require('uuid'); // Generador de códigos únicos

const generateTicket = async (req, res) => {
    try {
        const { userId, cartId } = req.body;

        // Obtener el carrito del usuario
        const cart = await CartDAO.getCartById(cartId);
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        let totalAmount = 0;
        let purchasedProducts = [];

        for (const item of cart.products) {
            if (item.product.stock >= item.quantity) {
                totalAmount += item.product.price * item.quantity;
                purchasedProducts.push({ product: item.product._id, quantity: item.quantity });

                // Actualizar stock del producto
                await ProductDAO.updateProduct(item.product._id, { stock: item.product.stock - item.quantity });
            } else {
                return res.status(400).json({ error: `Stock insuficiente para ${item.product.title}` });
            }
        }

        // Crear el ticket usando DAO
        const newTicket = await TicketDAO.createTicket({
            code: uuidv4(),
            user: userId,
            products: purchasedProducts,
            totalAmount
        });

        res.json({ message: "Compra realizada con éxito", ticket: new TicketDTO(newTicket) });

    } catch (error) {
        console.error("Error generando ticket:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { generateTicket };
