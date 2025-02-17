const express = require('express');
const router = express.Router();
const { postLogin, getCurrentSession, registerUser, requestPasswordReset, resetPassword } = require('../controllers/sessionController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');


// Ruta para login
router.post('/', postLogin);
router.post('/register', registerUser);
// Nueva ruta para obtener la sesión actual
router.get('/current', authenticateJWT, getCurrentSession);



// Ruta para restablecer la contraseña con un token válido
router.post('/reset-password/:token', resetPassword);


// Ruta para solicitar la recuperación de contraseña
router.post('/forgot-password', requestPasswordReset);

router.get("/forgot-password", (req, res) => {
    res.render("forgotPassword"); // Renderiza la vista Handlebars
});

router.get('/admin-catalog', authenticateJWT, authorizeRoles("admin"), (req, res) => res.render('realTimeProducts'));


router.get('/current', authenticateJWT, (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        const userDTO = new UserDTO(req.user); // ✅ Convertimos el usuario a DTO
        res.json({ user: userDTO }); // 🔄 Retornamos solo la info necesaria
    } catch (error) {
        console.error("❌ Error en /current:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

module.exports = router;
