const { Socket } = require('socket.io');
const net = require('net');

module.exports = class AgentConnection {
    /** @type {number} */
    id;

    /** @type {net.Socket} */
    socket;

    /** @type {Socket} */
    io;

    /** @type {number} */
    port = 25565;

    /**
     * @callback AgentDisconnect
     * @param {number} id - The clients id
    */

    /** @type {AgentConnection} */
    onDisconnect = null;

    /**
     * @param {net.Socket} socket 
     * @param {Socket} io
     * @param {AgentDisconnect} onDisconnect
     */
    constructor(socket, io, onDisconnect = null) {
        this.id = Math.round(Math.random() * 1000000);
        this.socket = socket;
        this.io = io;
        this.onDisconnect = onDisconnect;

        this.engine();
    }

    disconnect() {
        this.socket.destroy();
    }

    engine() {
        this.io.emit('net connect', this.id, this.port);

        this.socket.on('data', data => {
            this.io.emit('net data', this.id, data);
        });

        this.socket.on('close', () => {
            this.io.emit('net disconnect', this.id);
            this.onDisconnect(this.id);
        });
    }
}