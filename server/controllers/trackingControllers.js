const db = require("../configure/database");

const getBagTimeline = (req, res) => {

    const { bagId } = req.params;

    if (!bagId) {
        return res.status(400).json({
            success: false,
            message: "Bag ID is required"
        });
    }

    // Get Bag Details
    const bagSql = `
        SELECT
            bag_id,
            flight_no,
            destination_airport,
            bag_lock_status,
            bag_presence,
            timestamp,
            checkout_timestamp
        FROM baggage_records
        WHERE bag_id = ?
    `;

    db.query(bagSql, [bagId], (bagErr, bagResult) => {

        if (bagErr) {

            console.log(bagErr);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        if (bagResult.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Bag Not Found"
            });

        }

        const timelineSql = `
            SELECT
                activity,
                activity_time
            FROM activity_logs
            WHERE bag_id = ?
            ORDER BY activity_time ASC
        `;

        db.query(timelineSql, [bagId], (timelineErr, timelineResult) => {

            if (timelineErr) {

                console.log(timelineErr);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            return res.json({

                success: true,

                bag: bagResult[0],

                timeline: timelineResult

            });

        });

    });

};

module.exports = {
    getBagTimeline
};