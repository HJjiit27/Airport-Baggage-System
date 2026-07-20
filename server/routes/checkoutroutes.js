const express = require("express");

const router = express.Router();

const {
    getCheckoutBag,
    checkoutBag
} = require("../controllers/checkoutcontrollers")

// Search Bag
router.get("/:bagId", getCheckoutBag);

// Checkout Bag
router.put("/:bagId", checkoutBag);

module.exports = router;