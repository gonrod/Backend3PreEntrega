const { generateAndStoreMocks } = require("../services/mocksService");

/**
 * Handles API request to generate mock data.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const generateMocks = async (req, res) => {
    try {
        const numUsers = parseInt(req.params.users);
        const numProducts = parseInt(req.params.products);

        if (isNaN(numUsers) || isNaN(numProducts)) {
            return res.status(400).json({ error: "Los parámetros deben ser números válidos." });
        }

        const data = await generateAndStoreMocks(numUsers, numProducts);

        res.status(201).json({
            message: "Usuarios y productos generados con éxito.",
            usersCreated: data.users.length,
            productsCreated: data.products.length,
            users: data.users,
            products: data.products,
        });
    } catch (error) {
        console.error("❌ Error in generateMocks:", error);
        res.status(500).json({ error: "Error generando datos de prueba." });
    }
};

module.exports = { generateMocks };
