const db = require("../configure/database");



const getRecords = (req, res) => {

    const sql = "SELECT * FROM baggage_records";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

};
const updateRecord = (req, res) => {

    const { id } = req.params;

    const {
        iata_code,
        flight_no,
      destination_airport,
        bag_presence,
        bag_lock_status,
        timestamp
    } = req.body;

    const sql = `
        UPDATE baggage_records
        SET
            iata_code = ?,
            flight_no = ?,
           destination_airport = ?,
            bag_presence = ?,
            bag_lock_status = ?,
            timestamp = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            iata_code,
            flight_no,
            destination_airport,
            bag_presence,
            bag_lock_status,
            timestamp,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Record Updated Successfully ✅"
            });

        }
    );

};
const deleteRecord = (req, res) => {

    const { id } = req.params;

    // Pehle bag_id nikalo
    const getBagSql = `
        SELECT bag_id
        FROM baggage_records
        WHERE id = ?
    `;

    db.query(getBagSql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Record Not Found"
            });
        }

        const bagId = result[0].bag_id;

        // Pehle activity logs delete
        const deleteActivitySql = `
            DELETE FROM activity_logs
            WHERE bag_id = ?
        `;

        db.query(deleteActivitySql, [bagId], (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            // Fir baggage record delete
            const deleteBagSql = `
                DELETE FROM baggage_records
                WHERE id = ?
            `;

            db.query(deleteBagSql, [id], (err) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    success: true,
                    message: "Record Deleted Successfully 🗑️"
                });

            });

        });

    });

};




module.exports = {
    getRecords,
    updateRecord,
    deleteRecord
};
