require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const dashboardRoutes = require("./routes/dashboardroutes");
const recentActivityRoutes = require("./routes/recentactivityroutes");
const checkInRoutes = require("./routes/CheckInroutes");
const recordsRoutes = require("./routes/recordsRoutes");
const checkoutRoutes = require("./routes/checkoutroutes");
const trackingRoutes = require("./routes/trackingRoutes");

require("./configure/database");

const { connectRabbitMQ } = require("./rabbitmq/rabbitmq");

const startTrackingConsumer = require("./consumers/trackingconsumers");
const startLoadingConsumer = require("./consumers/loadingconsumers");
const startSecurityConsumer = require("./consumers/securityConsumer");

const { init } = require("./socket");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/dashboard", dashboardRoutes);
app.use("/recent-activity", recentActivityRoutes);
app.use("/checkin", checkInRoutes);
app.use("/records", recordsRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/tracking", trackingRoutes);

// Test Route
app.get("/hello", (req, res) => {
    res.send("Server is Working 🚀");
});

const server = http.createServer(app);

// Initialize Socket.IO
init(server);

async function startServer() {
    try {

        console.log("🔄 Connecting to RabbitMQ...");

        await connectRabbitMQ();

        console.log("✅ RabbitMQ Connected");

        await startTrackingConsumer();
        await startLoadingConsumer();
        await startSecurityConsumer();

        const PORT = process.env.PORT || 5000;

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {

        console.log("❌ Failed to start server");
        console.error(err);

    }
}

startServer();