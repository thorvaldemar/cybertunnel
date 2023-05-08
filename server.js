const CONFIG = require('./config.json');

const express = require('express');
const ProxyPort = require('./proxyport');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { Server } = require('socket.io');
const package = require('./package.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// app.use(morgan('dev'));

/** @type {Array<ProxyPort>} */
const proxyports = [];

app.get('/cybertunnel-info', (req, res) => res.send({
    name: package.name,
    version: package.version,
    type: 'server',
}));

app.use((req, res, next) => {
    console.log({
        url: req.url,
        protocol: req.protocol,
        method: req.method,
        headers: req.headers,
        cookies: req.cookies,
        port: CONFIG.port,
    });
    next();
});

io.on('connection', (socket) => {
    const query = socket.request.url.split('?')[1].split('&').map(e => e.split('=')[0]).reduce((o, key, i) => ({...o, [key]: socket.request.url.split('&')[i].split('=')[1]}), {});
    if (CONFIG.console.username == query['username'] && CONFIG.console.password == query['password']) {
        socket.on('console get', (type, cb) => {
            switch (type) {
                case "port":
                case "ports":
                    cb(proxyports.map(e => e.port));
                    break;
                default:
                    cb("Unkown type");
                    break;
            }
        });
        socket.on('console add', (type, add, cb) => {
            switch (type) {
                case 'port':
                case 'ports':
                    if (proxyports.find(e => e.port == add) != null) return cb("Port is already active");
                    proxyports.push(new ProxyPort(add));
                    cb(`Port: ${add} has been added to the proxies`);
                    break;
                default:
                    cb("Unkown type");
                    break;
            }
        });
        return;
    }
    console.log(socket.request.url);
    console.log("Connection established");
    socket.on('pong', () => console.log("Recieved pong from client"));
    socket.emit('ping');
});

server.listen(CONFIG.port, () => {
    console.log(`Listening to *:${CONFIG.port}`);
});