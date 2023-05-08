const { io } = require('socket.io-client');
const socket = io('ws://localhost:28569');

socket.on('connect', () => {
    console.log("Connection established");
});

socket.on('ping', () => {
    console.log("Ping recieved from the server -> Sending pong");
    socket.emit('pong');
});