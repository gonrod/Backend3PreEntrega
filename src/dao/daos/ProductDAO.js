const Product = require('../models/Product');

class ProductDAO {

    static async getAll() {
        const products = await Product.find();
        return products;
    }

    async getAllProducts(filters = {}) {
        try {
            return await Product.find(filters);
        } catch (error) {
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            return await Product.findById(productId);
        } catch (error) {
            throw error;
        }
    }

    async createProduct(productData) {
        try {
            const newProduct = new Product(productData);
            return await newProduct.save();
        } catch (error) {
            throw error;
        }
    }

    async createProducts(products) {
        try {
            return await Product.insertMany(products);
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(productId, updateData) {
        try {
            return await Product.findByIdAndUpdate(productId, updateData, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            return await Product.findByIdAndDelete(productId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProductDAO();
