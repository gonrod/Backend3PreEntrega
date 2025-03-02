const { faker } = require('@faker-js/faker');
const { saveMockData } = require("../dao/repositories/MocksRepository");

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
        password: faker.internet.password()
    }));
};

/**
 * Genera datos de productos ficticios.
 * @param {number} numProducts - Numero de productos a generar.
 * @returns {Array} Array de productos.
 */
const generateMockProducts = (numProducts) => {
    return Array.from({ length: numProducts }, () => ({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 1, max: 100 }), // ✅ Corregido: `faker.number.int()`
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
        console.log("🔹 Generando", numUsers, "usuarios y", numProducts, "productos...");
        const users = generateMockUsers(numUsers);
        const products = generateMockProducts(numProducts);
        
        console.log("✅ Usuarios Generados:", users);
        console.log("✅ Productos Generados:", products);

        const savedData = await saveMockData(users, products);

        console.log("✅ Datos guardados en la base de datos:", savedData);
        return savedData;
    } catch (error) {
        console.error("❌ Error detallado:", error);
        throw new Error("Error generando datos de prueba.");
    }
};

module.exports = { generateAndStoreMocks };
