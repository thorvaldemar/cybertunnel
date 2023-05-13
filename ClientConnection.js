const AgentConnection = require('./AgentConnection');
const { Socket } = require('socket.io');
const net = require('net');

module.exports = class ClientConnection {
    /** @type {number} */
    id;

    /** @type {Socket} */
    socket;

    /** @type {Array<AgentConnection>} */
    agents = [];

    /**
     * @callback ClientDisconnect
     * @param {number} id - The clients id
     */

    /**
     * @param {Socket} socket 
     * @param {ClientDisconnect} onDisconnect
     */
    constructor(socket, onDisconnect = null) {
        this.id = 0; // Math.round(Math.random() * 1000000);
        this.socket = socket;

        this.socket.on('disconnect', () => {
            this.agents.forEach(agent => {
                agent.disconnect();
            });
            if (onDisconnect) onDisconnect(this.id);
        });

        this.socket.on('net data', (id, data) => {
            this.agents.find(e => e.id === id)?.socket.write(data);
        });
        
        this.socket.on('net disconnect', id => {
            this.agents.find(e => e.id === id)?.disconnect();
        });
    }

    /**
     * @param {net.Socket} agentSocket 
     */
    addAgent(agentSocket) {
        this.agents.push(new AgentConnection(
            agentSocket,
            this.socket,
            (id) => {
                const index = this.agents.findIndex(e => e.id == id);
                if (index > 0) this.agents.splice(index, 1);
            }
        ));
    }
}