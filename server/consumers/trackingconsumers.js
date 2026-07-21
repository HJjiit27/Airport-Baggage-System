const { getChannel } = require("../rabbitmq/rabbitmq");
const db = require("../configure/database");
const { getIO } = require("../socket");

async function startTrackingConsumer() {
    const channel = getChannel();

    const queue = "tracking_queue";

    await channel.assertQueue(queue, {
        durable: true
    });

    console.log("🎧 Tracking Consumer Started...");

    channel.consume(queue, (msg) => {

        if (!msg) return;

        const bag = JSON.parse(msg.content.toString());


        console.log("📥 Tracking Received:", bag);

        const activitySql = `
            INSERT INTO activity_logs
            (bag_id, activity)
            VALUES (?, ?)
        `;

        db.query(
            activitySql,
            [
                bag.bagId,
                "Checked In"
            ],
            (err) => {

                if (err) {
                    console.log("❌ Activity Log Error");
                    console.log(err);

                    channel.ack(msg);
                    return;
                }

                console.log("✅ Checked In Activity Saved");
                

channel.publish(
    "airport_exchange",
    "bag.tracked",
    Buffer.from(JSON.stringify(bag)),
    {
        persistent: true 
    }
);                                                             
 

console.log("📤 bag.tracked Published");

                getIO().emit("dashboard-update");
                getIO().emit("activity-update");

                channel.ack(msg);

            }
        );

    });
}

module.exports = startTrackingConsumer;

