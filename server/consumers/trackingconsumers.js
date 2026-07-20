const { getIO } = require("../socket");
const { getChannel } = require("../rabbitmq/rabbitmq");
const db = require("../configure/database");

async function startTrackingConsumer() {

    const channel = getChannel();

    await channel.assertQueue("tracking_queue", {
        durable: true
    });

    console.log("🎧 Tracking Consumer Started...");

    channel.consume("tracking_queue", (msg) => {

        if (!msg) return;

        const data = JSON.parse(msg.content.toString());

        console.log("📥 Tracking Received:", data);

        const activitySql = `
            INSERT INTO activity_logs
            (bag_id, flight_no, activity)
            VALUES (?, ?, ?)
        `;

        db.query(
            activitySql,
            [
                data.bagId,
                data.flight_no,
                data.status
            ],
            (err) => {

                if (err) {

                    console.log("❌ Activity Log Error");
                    console.log(err);

                    channel.ack(msg);
                    return;

                }

                console.log("✅ Activity Saved");

                const updateSql = `
                    UPDATE baggage_records
                    SET bag_status = ?
                    WHERE bag_id = ?
                `;

                db.query(
                    updateSql,
                    [
                        "Tracking Completed",
                        data.bagId
                    ],
                    (err) => {

                        if (err) {

                            console.log("❌ Status Update Error");
                            console.log(err);

                        } else {

                            console.log("✅ Bag Status Updated : Tracking Completed");

                        }

                        getIO().emit("dashboard-update");
                        getIO().emit("activity-update");

                        console.log("📡 Dashboard Event Sent");

                        const trackedEvent = {
                            bagId: data.bagId,
                            flight_no: data.flight_no,
                            status: "Tracking Completed",
                            timestamp: new Date().toISOString()
                        };

                        channel.publish(
                            "airport_exchange",
                            "bag.tracked",
                            Buffer.from(JSON.stringify(trackedEvent)),
                            {
                                persistent: true
                            }
                        );

                        console.log("📤 bag.tracked Published");

                        channel.ack(msg);

                    }
                );

            }
        );

    });

}

module.exports = startTrackingConsumer;