const express = require("express");

const router = express.Router();

const {
    getRecentActivity
} = require("../controllers/recentactivitycontrollers");

router.get("/", getRecentActivity);

module.exports = router;