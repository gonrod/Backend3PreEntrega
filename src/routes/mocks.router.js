const express = require("express");
const { generateMocks } = require("../controllers/mocksController");

const router = express.Router();

router.post("/:users/:products", generateMocks);

module.exports = router;
