const express = require('express');
const { generateMockUsers, generateMockProducts } = require('../utils/mocks');
const UserRepository = require('../dao/repositories/UserRepository');
const ProductRepository = require('../dao/repositories/ProductRepository');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/:users/:products', async (req, res) => {
    const { users, products } = req.params;

    logger.http(`Received request to generate ${users} users and ${products} products`);

    try {
        const numUsers = parseInt(users, 10);
        const numProducts = parseInt(products, 10);

        if (isNaN(numUsers) || isNaN(numProducts)) {
            logger.error(`Invalid parameters: users=${users}, products=${products}`);
            return res.status(400).json({ error: 'Parameters must be numbers' });
        }

        const newUsers = generateMockUsers(numUsers);
        const newProducts = generateMockProducts(numProducts);

        await Promise.all([
            ...newUsers.map(user => UserRepository.createUser(user)),
            ...newProducts.map(product => ProductRepository.addProduct(product))
        ]);

        logger.info(`Successfully generated ${numUsers} users and ${numProducts} products`);
        res.status(201).json({
            message: 'Users and products successfully created',
            usersCreated: numUsers,
            productsCreated: numProducts
        });

    } catch (error) {
        logger.error(`Error generating mocks: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
