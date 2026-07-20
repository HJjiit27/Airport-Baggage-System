const db = require("../configure/database");
const { getIO } = require("../socket");

// ===============================
// GET BAG DETAILS
// ===============================

const getCheckoutBag = (req, res) => {

    const { bagId } = req.params;

    const sql = `
        SELECT *
        FROM baggage_records
        WHERE bag_id = ?
    `;

    db.query(sql, [bagId], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Bag Not Found"
            });
        }

        return res.json(result[0]);

    });

};

// ===============================
// CHECKOUT BAG
// ===============================

const checkoutBag = (req, res) => {

    const { bagId } = req.params;

    const {
        bag_lock_status,
        checkout_status = "Checked Out",
        remarks = null
    } = req.body;

    // Decide Bag Status

    let bagStatus = "Checked Out";
    let bagPresence = "Present";

    if (checkout_status === "Missing") {
        bagStatus = "Missing";
        bagPresence = "Missing";
    }

    const updateSql = `
        UPDATE baggage_records
        SET
            bag_status = ?,
            bag_presence = ?,
            bag_lock_status = ?,
            checkout_status = ?,
            remarks = ?
        WHERE bag_id = ?
    `;

    db.query(
        updateSql,
        [
            bagStatus,
            bagPresence,
            bag_lock_status,
            checkout_status,
            remarks,
            bagId
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Bag Not Found"
                });

            }

            // Activity Message

            let activity = "";

            switch (checkout_status) {

                case "Missing":
                    activity = "Bag Marked as Missing";
                    break;

                case "Damaged":
                    activity = "Bag Reported Damaged";
                    break;

                case "Lock Broken":
                    activity = "Bag Lock Broken";
                    break;

                default:
                    activity = "Bag Checked Out";

            }

            const activitySql = `
                INSERT INTO activity_logs
                (bag_id, activity)
                VALUES (?, ?)
            `;

            db.query(
                activitySql,
                [
                    bagId,
                    activity
                ],
                (err) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            success: false,
                            message: "Activity Log Error"
                        });

                    }

                    // Socket Updates

                    getIO().emit("dashboard-update");
                    getIO().emit("activity-update");
                    getIO().emit("records-update");

                    // Success Message

                    let message = "";

                    switch (checkout_status) {

                        case "Missing":
                            message = "Bag Marked as Missing Successfully";
                            break;

                        case "Damaged":
                            message = "Damage Report Saved Successfully";
                            break;

                        case "Lock Broken":
                            message = "Lock Broken Report Saved Successfully";
                            break;

                        default:
                            message = "Bag Checked Out Successfully";

                    }

                    return res.json({
                        success: true,
                        message
                    });

                }
            );

        }
    );

};

module.exports = {
    getCheckoutBag,
    checkoutBag
};
