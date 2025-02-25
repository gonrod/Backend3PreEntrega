const faker = require("@faker-js/faker");
const { saveMockData } = require("../repositories/mocksRepository");

/**
 * Generates mock user data.
 * @param {number} numUsers - Number of users to generate.
 * @returns {Array} Array of user objects.
 */
const generateMockUsers = (numUsers) => {
    return Array.from({ length: numUsers }, () => ({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 80 }),
        role: faker.helpers.arrayElement(["user", "admin"]),
    }));
};

/**
 * Generates mock product data.
 * @param {number} numProducts - Number of products to generate.
 * @returns {Array} Array of product objects.
 */
const generateMockProducts = (numProducts) => {
    return Array.from({ length: numProducts }, () => ({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 1, max: 100 }),
        category: faker.commerce.department(),
        code: faker.string.uuid(),
    }));
};

/**
 * Generates mock users and products, then stores them in the database.
 * @param {number} numUsers - Number of users to generate.
 * @param {number} numProducts - Number of products to generate.
 * @returns {Object} Saved users and products.
 */
const generateAndStoreMocks = async (numUsers, numProducts) => {
    try {
        const users = generateMockUsers(numUsers);
        const products = generateMockProducts(numProducts);
        return await saveMockData(users, products);
    } catch (error) {
        console.error("❌ Error generating mock data:", error);
        throw new Error("Error generating mock data.");
    }
};

module.exports = { generateAndStoreMocks };
