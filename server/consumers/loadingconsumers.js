const { getChannel } = require("../rabbitmq/rabbitmq");
const db = require("../configure/database");
const { getIO } = require("../socket");

async function startLoadingConsumer() {

    const channel = getChannel();

    const queue = "loading_queue";

    await channel.assertQueue(queue, {
        durable: true
    });

    console.log("✈️ Loading Consumer Started...");

    channel.consume(queue, (msg) => {

        if (!msg) return;

        const bag = JSON.parse(msg.content.toString());

        console.log("✈️ Aircraft Loading Started");
        console.log(bag.bagId);

        setTimeout(() => {

            const activitySql = `
                INSERT INTO activity_logs
                (bag_id, activity)
                VALUES (?, ?)
            `;

            db.query(
                activitySql,
                [
                    bag.bagId,
                    "Aircraft Loaded"
                ],
                (err) => {

                    if (err) {

                        console.log("❌ Loading Activity Log Error");
                        console.log(err);

                        channel.ack(msg);
                        return;
                    }

                    console.log("✅ Aircraft Loaded Activity Saved");

                    const updateSql = `
                        UPDATE baggage_records
                        SET bag_status = ?
                        WHERE bag_id = ?
                    `;

                    db.query(
                        updateSql,
                        [
                            "Aircraft Loaded",
                            bag.bagId
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

                            channel.ack(msg);

                        }
                    );

                }
            );

        }, 2000);

    });

}

module.exports = startLoadingConsumer;