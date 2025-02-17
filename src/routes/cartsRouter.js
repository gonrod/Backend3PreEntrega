const express = require('express');
const { createCart, getCartById, addProductToCart, removeProductFromCart, checkoutCart, getCartIdByUser, getCartView, finalizePurchase } = require('../controllers/cartsController');
const { authenticateJWT } = require('../middlewares/auth');
const UserRepository = require('../dao/repositories/UserRepository');

const router = express.Router();

// Nueva ruta para obtener el carrito del usuario autenticado
router.get('/my-cart', authenticateJWT, async (req, res) => {
    try {
        console.log("🔍 Datos de `req.user` en `/my-cart`:", req.user); // Verifica si `req.user` tiene datos
        if (!req.user || !req.user.id) {
            console.error("❌ Usuario no autenticado en `/my-cart`");
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        const user = await UserRepository.getUserById(req.user.id);
        if (!user || !user.cart) {
            console.error("❌ Carrito no encontrado para usuario:", req.user.id);
            return res.status(404).json({ error: "Carrito no encontrado para el usuario." });
        }

        console.log("✅ Carrito encontrado:", user.cart);
        res.json({ cartId: user.cart });

    } catch (error) {
        console.error("❌ Error obteniendo el cartId:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
router.get('/view', authenticateJWT, getCartView);

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/product/:pid', removeProductFromCart);
router.post('/:cid/checkout', checkoutCart);

router.post('/:cid/purchase', authenticateJWT, finalizePurchase);


module.exports = router;
