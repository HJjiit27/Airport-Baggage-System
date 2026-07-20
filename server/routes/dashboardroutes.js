const express = require("express");

const router = express.Router();

const {
    getDashboardStats
} = require("../controllers/dashboardcontrollers");

router.get("/", getDashboardStats);

module.exports = router;