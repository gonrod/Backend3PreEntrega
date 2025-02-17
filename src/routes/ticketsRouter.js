const express = require('express');
const { generateTicket } = require('../controllers/ticketController');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

router.post('/', authenticateJWT, generateTicket);

module.exports = router;
