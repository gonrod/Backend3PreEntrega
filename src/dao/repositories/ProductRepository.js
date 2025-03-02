const ProductDAO = require('../daos/ProductDAO');

class ProductRepository {
    static async getAllProducts() {
        return await ProductDAO.getAllProducts();
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

    static async createProduct(productData) {
        return await ProductDAO.createProduct(productData);
    }

    static async createProducts(products) {
        return await ProductDAO.createProducts(products);
    }

    static async updateProduct(id, productData) {
        return await ProductDAO.updateProduct(id, productData);
    }

    static async deleteProduct(id) {
        return await ProductDAO.deleteProduct(id);
    }
}

module.exports = ProductRepository;
