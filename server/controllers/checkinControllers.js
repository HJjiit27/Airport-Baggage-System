const db = require("../configure/database");
const { getChannel } = require("../rabbitmq/rabbitmq");

const checkInBag = (req, res) => {

    const {
        iata_code,
        flight_no,
        destination_airport,
        bag_presence,
        bag_lock_status
    } = req.body;

    const insertQuery = `
        INSERT INTO baggage_records
        (iata_code, flight_no, destination_airport, bag_presence, bag_lock_status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        insertQuery,
        [
            iata_code,
            flight_no,
            destination_airport,
            bag_presence,
            bag_lock_status
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            const bagId = "BG" + String(result.insertId).padStart(6, "0");

            db.query(
                "UPDATE baggage_records SET bag_id=? WHERE id=?",
                [bagId, result.insertId],
                (err2) => {

                    if (err2) {
                        console.log(err2);
                        return res.status(500).json(err2);
                    }

                    const channel = getChannel();

                    const event = {
                        bagId,
                        flight_no,
                        status: "Checked In",
                        timestamp: new Date().toISOString()
                    };

                    channel.publish(
                        "airport_exchange",
                        "bag.checkedin",
                        Buffer.from(JSON.stringify(event)),
                        {
                            persistent: true
                        }
                    );

                    console.log("📤 bag.checkedin Published");

                  res.json({
    success: true,
    message: "Bag Checked In Successfully ✅",
    bag_id: bagId
});

                }
            );

        }
    );
};

module.exports = {
    checkInBag
};