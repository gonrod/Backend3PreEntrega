const ProductDAO = require('../daos/ProductDAO');

class ProductRepository {
    static async getAllProducts() {
        const products = await ProductDAO.getAllProducts();
        return products;
    }

    static async getFilteredProducts(filters) {
        return await ProductDAO.getAllProducts(filters);
    }

    static async getProductById(id) {
        try {
            const product = await ProductDAO.getProductById(id);
            if (!product) {
                console.error(`❌ Producto con ID ${id} no encontrado en la base de datos.`);
                return null;
            }
    
            // Verificar que los datos esenciales existen
            if (!product.title || !product.price) {
                console.warn(`⚠️ Producto con ID ${id} encontrado, pero le faltan datos:`, product);
            }
    
            console.log("✅ Producto obtenido correctamente:", product);
            return product;
        } catch (error) {
            console.error("❌ Error al obtener producto:", error);
            throw error;
        }
    }

    static async addProduct(productData) {
        return await ProductDAO.createProduct(productData);
    }

    static async updateProduct(id, productData) {
        return await ProductDAO.updateProduct(id, productData)
    }

    static async deleteProduct(id) {
        return await ProductDAO.deleteProduct(id)
    }
}

module.exports = ProductRepository;
