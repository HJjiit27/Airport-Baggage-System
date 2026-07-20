const db = require("../configure/database");
console.log("NEW DASHBOARD CONTROLLER LOADED");
const getDashboardStats = (req, res) => {
console.log("Dashboard API Called");
   const sql = `
SELECT
    COUNT(*) AS totalBags,

    COUNT(CASE WHEN checkout_timestamp IS NULL THEN 1 END) AS checkedInBags,

    COUNT(CASE WHEN checkout_timestamp IS NOT NULL THEN 1 END) AS checkedOutBags,

    COUNT(CASE WHEN bag_presence = 'Missing' THEN 1 END) AS missingBags

FROM baggage_records;
`;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result[0]);

    });

};

module.exports = {
    getDashboardStats
};