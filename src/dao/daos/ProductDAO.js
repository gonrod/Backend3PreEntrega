const Product = require('../models/Product');

class ProductDAO {

    static async getAll() {
        const products = await ProductModel.find();
        return products;
    }

    async getAllProducts(filters = {}) {
        try {
            return await Product.find(filters);
        } catch (error) {
            console.error("Error obteniendo productos:", error);
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            return await Product.findById(productId);
        } catch (error) {
            console.error("Error obteniendo el producto:", error);
            throw error;
        }
    }

    async createProduct(productData) {
        try {
            const newProduct = new Product(productData);
            return await newProduct.save();
        } catch (error) {
            console.error("Error creando producto:", error);
            throw error;
        }
    }

    async updateProduct(productId, updateData) {
        try {
            return await Product.findByIdAndUpdate(productId, updateData, { new: true });
        } catch (error) {
            console.error("Error actualizando producto:", error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            return await Product.findByIdAndDelete(productId);
        } catch (error) {
            console.error("Error eliminando producto:", error);
            throw error;
        }
    }
}

module.exports = new ProductDAO();
