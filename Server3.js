const express = require('express');
const cors = require('cors');
const http = require('http');
const { createAdapter } = require("@socket.io/redis-adapter");
const { pubClient, subClient } = require("./redisConfig");

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, {
    maxHttpBufferSize: 5 * 1024 * 1024,
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
        credentials: true
    }
});

io.adapter(createAdapter(pubClient, subClient, { requestsTimeout: 5000 }));

io.on("connection", (socket) => {
    console.log("Client connected to app3");
    socket.on("clientMessage3", (data) => {
        console.log("Received message from client:", data);
        data.status = "response3";
        io.emit("clientMessage3R", data);
    });
});

const PORT = 3003;
server.listen(PORT, () => {
    console.log(`Server3 is running on port ${PORT}`);
});