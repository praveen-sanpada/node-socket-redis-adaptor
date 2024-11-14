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

function broadcastMessage(event, data) {
    io.emit(event, data);  
}

setInterval(() => {
    broadcastMessage("clientMessage1R", { user_id: 1, name: 'user1' });
    broadcastMessage("clientMessage2R", { user_id: 2, name: 'user2' });
    broadcastMessage("clientMessage3R", { user_id: 3, name: 'user3' });
}, 5000);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Main Server is running on port ${PORT}`);
});