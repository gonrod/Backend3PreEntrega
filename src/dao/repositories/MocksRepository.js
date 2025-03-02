const UserRepository = require("./UserRepository");
const ProductRepository = require("./ProductRepository");

/**
 * Saves generated mock users and products to the database.
 * @param {Array} users - Array of mock user objects.
 * @param {Array} products - Array of mock product objects.
 * @returns {Object} Object containing saved users and products.
 */
const saveMockData = async (users, products) => {
    try {
        for (const user of users) {
            await UserRepository.createUser(user);
        }

        await ProductRepository.createProducts(products); // ✅ Usamos `createProducts()`

        return { users, products };
    } catch (error) {
        console.error("❌ Error saving mock data:", error);
        throw new Error("Error saving mock data to the database.");
    }
};

module.exports = { saveMockData };
