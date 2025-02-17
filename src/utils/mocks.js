const faker = require('@faker-js/faker');

// Generate fake users
const generateMockUsers = (count) => {
    return Array.from({ length: count }, () => ({
        first_name: faker.faker.person.firstName(),
        last_name: faker.faker.person.lastName(),
        email: faker.faker.internet.email(),
        age: faker.faker.number.int({ min: 18, max: 70 }),
        password: faker.faker.internet.password(),
        cart: null,
        role: 'user',
        resetToken: null,
        resetTokenExpiration: null
    }));
};

// Generate fake products
const generateMockProducts = (count) => {
    return Array.from({ length: count }, () => ({
        title: faker.faker.commerce.productName(),
        description: faker.faker.commerce.productDescription(),
        code: faker.faker.string.alphanumeric(10), 
        price: parseFloat(faker.faker.commerce.price()),
        status: faker.faker.datatype.boolean(),
        stock: faker.faker.number.int({ min: 1, max: 100 }),
        category: faker.faker.commerce.department(),
        thumbnails: [faker.faker.image.url(), faker.faker.image.url()]
    }));
};

// Export functions using CommonJS
module.exports = { generateMockUsers, generateMockProducts };
