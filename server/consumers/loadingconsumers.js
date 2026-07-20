const { getChannel } = require("../rabbitmq/rabbitmq");
const db = require("../configure/database");
const { getIO } = require("../socket");

async function startLoadingConsumers() {

    const channel = getChannel();

    await channel.assertQueue("loading_queue", {
        durable: true
    });

    console.log("✈️ Loading Consumer Started...");

    channel.consume("loading_queue", (msg) => {

        if (!msg) return;

        const data = JSON.parse(msg.content.toString());

        console.log("================================");
        console.log("✈️ LOADING STARTED");
        console.log(data);
        console.log("================================");

        setTimeout(() => {

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
                    "Aircraft Loaded"
                ],
                (err) => {

                    if (err) {

                        console.log("❌ Loading Activity Log Error");
                        console.log(err);

                        channel.ack(msg);
                        return;

                    }

                    console.log("✅ Loading Activity Saved");

                    const updateSql = `
                        UPDATE baggage_records
                        SET bag_status = ?
                        WHERE bag_id = ?
                    `;

                    db.query(
                        updateSql,
                        [
                            "Aircraft Loaded",
                            data.bagId
                        ],
                        (err) => {

                            if (err) {

                                console.log("❌ Bag Status Update Error");
                                console.log(err);

                            } else {

                                console.log("✅ Bag Status Updated : Aircraft Loaded");

                            }

                            getIO().emit("dashboard-update");
                            getIO().emit("activity-update");

                            console.log("📡 Dashboard Updated");

                            // ✅ IMPORTANT
                            channel.ack(msg);

                            console.log("✅ Aircraft Loading Completed");
                            console.log(data.bagId);

                        }
                    );

                }
            );

        }, 2000);

    });

}

module.exports = startLoadingConsumers;