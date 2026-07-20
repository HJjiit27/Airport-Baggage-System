const { getChannel } = require("../rabbitmq/rabbitmq");
const db = require("../configure/database");
const { getIO } = require("../socket");

async function startSecurityConsumer() {

    const channel = getChannel();

    const queue = "security_queue";

    await channel.assertQueue(queue, {
        durable: true
    });

    console.log("🛡 Security Consumer Started...");

    channel.consume(queue, (msg) => {

        if (!msg) return;

        const bag = JSON.parse(msg.content.toString());

        console.log("🛡 Security Scan Started");
        console.log(bag.bagId);

        // Security pehle complete hogi
        setTimeout(() => {

            const activitySql = `
                INSERT INTO activity_logs
                (bag_id, flight_no, activity)
                VALUES (?, ?, ?)
            `;

            db.query(
                activitySql,
                [
                    bag.bagId,
                    bag.flight_no,
                    "Security Cleared"
                ],
                (err) => {

                    if (err) {

                        console.log("❌ Security Activity Log Error");
                        console.log(err);

                        channel.ack(msg);
                        return;

                    }

                    console.log("✅ Security Activity Saved");

                    const updateSql = `
                        UPDATE baggage_records
                        SET bag_status = ?
                        WHERE bag_id = ?
                    `;

                    db.query(
                        updateSql,
                        [
                            "Security Cleared",
                            bag.bagId
                        ],
                        (err) => {

                            if (err) {

                                console.log("❌ Bag Status Update Error");
                                console.log(err);

                            } else {

                                console.log("✅ Bag Status Updated : Security Cleared");

                            }

                            getIO().emit("dashboard-update");
                            getIO().emit("activity-update");

                            console.log("📡 Dashboard Updated");

                            // ✅ IMPORTANT
                            channel.ack(msg);

                        }
                    );

                }
            );

        }, 1500);

    });

}

module.exports = startSecurityConsumer;