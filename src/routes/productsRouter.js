const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById,
    renderCatalog,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    generateTestProducts, 
    deleteAllProducts 
} = require('../controllers/productsController');


const { authenticateJWT, authorizeRoles } = require('../middlewares/auth'); // ✅ Reemplazar isAdmin por authorizeRoles

// Endpoints para productos
//router.get('/', getProducts); // Ruta para listar productos con filtros, paginación y ordenamiento
router.get('/', authenticateJWT, authorizeRoles("admin", "user"), renderCatalog); // Admins y usuarios pueden ver el catálogo
router.get('/:pid', getProductById); // Ruta para ver los detalles de un producto específico
router.post('/', authenticateJWT, authorizeRoles("admin"), addProduct); //  Solo admin puede agregar productos
router.put('/:pid', authenticateJWT, authorizeRoles("admin"), updateProduct); // Solo admin puede actualizar productos
router.delete('/:pid', authenticateJWT, authorizeRoles("admin"), deleteProduct); // Solo admin puede eliminar productos
router.post('/generate', authenticateJWT, authorizeRoles("admin"), generateTestProducts); //  Solo admin puede generar productos de prueba
router.delete('/deleteAll', authenticateJWT, authorizeRoles("admin"), deleteAllProducts);

module.exports = router;
