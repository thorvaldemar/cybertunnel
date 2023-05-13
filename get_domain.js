const net = require('net');

net.createServer(socket => {
    socket.on('data', data => console.log(data.getDomain()));
}).listen(3000);

const domains = [
    'minecraft.bella.cybertunnel.com',
    'localhost',
    '10.0.0.17'
]

Buffer.prototype.getDomain = function() {
    return domains.find(domain => this.toString('ascii').includes(domain)) ?? domains[0];
}