const Cart = require('../models/Cart');

class CartDAO {
    async getCartById(cartId) {
        try {
            return await Cart.findById(cartId).populate('products.product');
        } catch (error) {
            console.error("Error obteniendo el carrito:", error);
            throw error;
        }
    }

    async createCart(userId) {
        try {
            const newCart = new Cart({ user: userId, products: [] });
            return await newCart.save();
        } catch (error) {
            console.error("Error creando el carrito:", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            return await cart.save();
        } catch (error) {
            console.error("Error agregando producto al carrito:", error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            return await cart.save();
        } catch (error) {
            console.error("Error eliminando producto del carrito:", error);
            throw error;
        }
    }
}

module.exports = new CartDAO();
