const net = require('net');
const http = require('http');
const express = require('express');
const ClientConnection = require('./ClientConnection');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/** @type {Array<ClientConnection>} */
const clients = [];

app.use((req, res, next) => {
    console.log(req.get('host'));
    next();
});

io.on('connection', socket => {
    console.log("Client connected!");
    clients.push(new ClientConnection(socket, (id) => {
        const index = clients.findIndex(e => e.id == id);
        if (index > 0) clients.splice(index, 1);
    }));
})

net.createServer(agent => {
    const client = clients.find(e => e.id === 0);
    if (!client) {
        agent.write("No client connected");
        agent.destroy();
        return;
    }

    client.addAgent(agent);
}).listen(3000);

server.listen(28569);