const amqp = require("amqplib");

let connection = null;
let channel = null;

async function connectRabbitMQ() {
console.log("Connecting to RabbitMQ...");

connection = await amqp.connect(process.env.RABBITMQ_URL);

console.log("Connected Successfully");

channel = await connection.createChannel();

console.log("Channel Created");

    // Exchange
    await channel.assertExchange(
        "airport_exchange",
        "topic",
        {
            durable: true
        }
    );

    // Tracking Queue
    await channel.assertQueue("tracking_queue", {
        durable: true
    });

    await channel.bindQueue(
        "tracking_queue",
        "airport_exchange",
        "bag.checkedin"
    );

    // Security Queue
    await channel.assertQueue("security_queue", {
        durable: true
    });

    await channel.bindQueue(
        "security_queue",
        "airport_exchange",
        "bag.checkedin"
    );

    // Loading Queue
    await channel.assertQueue("loading_queue", {
        durable: true
    });

    await channel.bindQueue(
        "loading_queue",
        "airport_exchange",
        "bag.tracked"
    );

    console.log("✅ RabbitMQ Connected");
}

function getChannel() {

    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }

    return channel;
}

module.exports = {
    connectRabbitMQ,
    getChannel
};