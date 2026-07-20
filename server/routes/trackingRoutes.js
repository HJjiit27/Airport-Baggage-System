const express = require("express");

const router = express.Router();

const { getBagTimeline } = require("../controllers/trackingControllers");

router.get("/:bagId", getBagTimeline);

module.exports = router;