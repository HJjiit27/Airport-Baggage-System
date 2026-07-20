const db = require("../configure/database");

const getRecentActivity = (req, res) => {

    const sql = `
        SELECT
            bag_id,
            flight_no,
            destination_airport,
            bag_lock_status,
            bag_presence,
            timestamp,
            checkout_timestamp
        FROM baggage_records
        ORDER BY timestamp DESC
        LIMIT 5
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }



        res.json(result);

    });

};

module.exports = {
    getRecentActivity
};