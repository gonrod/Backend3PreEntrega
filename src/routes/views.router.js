const express = require('express');
const router = express.Router();
const { renderCatalog } = require("../controllers/productsController"); // ✅ Importa correctamente el controlador
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateJWT, (req, res) => {

    if (!req.user) {
        return res.redirect('/login'); // Si no está autenticado, lo mandamos a login
    }

    if (req.user.role === 'admin') {
        return res.redirect('/admin-catalog'); // Si es admin, va a la vista de administración
    }

    return res.redirect('/catalog'); // Si es user, va al catálogo
});

router.get('/catalog', renderCatalog);
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/forgot-password', (req, res) => res.render('forgotPassword'));
router.get('/reset-password/:token', (req, res) => {
    res.render('resetPassword', { token: req.params.token });
});
router.get('/admin-catalog', authenticateJWT, authorizeRoles("admin"), (req, res) => {
    res.render('realTimeProducts');
});
module.exports = router;