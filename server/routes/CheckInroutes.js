const express = require("express");
const router = express.Router();

const { checkInBag } = require("../controllers/checkinControllers");

router.post("/", checkInBag);

module.exports = router;