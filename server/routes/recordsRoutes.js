const express = require("express");

const router = express.Router();

const {
    getRecords,
    updateRecord,
    deleteRecord
} = require("../controllers/recordscontrollers");

// GET /records
router.get("/", getRecords);

// PUT /records/:id
router.put("/:id", updateRecord);

// DELETE /records/:id
router.delete("/:id", deleteRecord);

module.exports = router;