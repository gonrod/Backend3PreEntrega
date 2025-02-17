const CartDAO = require('../daos/CartDAO');

class CartRepository {
    async getCartById(cartId) {
        try {
            const cart = await CartDAO.getCartById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");
            return cart;
        } catch (error) {
            console.error("❌ Error en getCartById:", error);
            throw error;
        }
    }

    async createCart(userId) {
        try {
            return await CartDAO.createCart(userId);
        } catch (error) {
            console.error("❌ Error en createCart:", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await CartDAO.getCartById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            console.log("🛒 Carrito antes de agregar producto:", cart);

            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            const updatedCart = await cart.save();
            console.log("✅ Producto añadido al carrito:", updatedCart);
            return updatedCart;
        } catch (error) {
            console.error("❌ Error en addProductToCart:", error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartDAO.getCartById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            const updatedCart = await cart.save();
            console.log("✅ Producto eliminado del carrito:", updatedCart);
            return updatedCart;
        } catch (error) {
            console.error("❌ Error en removeProductFromCart:", error);
            throw error;
        }
    }


    async clearCart(cartId) {
        try {
            const cart = await CartDAO.getCartById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");
    
            cart.products = []; // Vaciar el carrito completamente
            await cart.save();
            console.log("✅ Carrito vaciado después de la compra.");
            return cart;
        } catch (error) {
            console.error("❌ Error en clearCart:", error);
            throw error;
        }
    }
    
}

module.exports = new CartRepository();
