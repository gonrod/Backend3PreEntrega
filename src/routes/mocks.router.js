const express = require('express');
const { generateMockUsers, generateMockProducts } = require('../utils/mocks');
const UserRepository = require('../dao/repositories/UserRepository');
const ProductRepository = require('../dao/repositories/ProductRepository');

const router = express.Router();

router.post('/:users/:products', async (req, res) => {
    try {
        const numUsers = parseInt(req.params.users, 10);
        const numProducts = parseInt(req.params.products, 10);

        if (isNaN(numUsers) || isNaN(numProducts)) {
            return res.status(400).json({ error: 'Parameters must be numbers' });
        }

        const newUsers = generateMockUsers(numUsers);
        const newProducts = generateMockProducts(numProducts);

        await Promise.all([
            ...newUsers.map(user => UserRepository.createUser(user)),
            ...newProducts.map(product => ProductRepository.addProduct(product))
        ]);

        res.status(201).json({
            message: 'Users and products successfully created',
            usersCreated: numUsers,
            productsCreated: numProducts
        });

    } catch (error) {
        console.error('❌ Error generating mocks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
