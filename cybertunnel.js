const args = {};
process.argv.slice(2).join(' ').split('-').slice(1).map(e => e.trim()).forEach(e => args[e.split(' ')[0].toLowerCase()] = e.split(' ').slice(1).join(' ').trim());

const CONFIG = require('./config.json');

const { io } = require('socket.io-client');
const socket = io(`ws://${CONFIG.console.host}:${CONFIG.port}?username=${CONFIG.console.username}&password=${CONFIG.console.password}`, {
    reconnectionAttempts: 3,
});

socket.on('connect', () => {
    if (!('c' in args || 'command' in args)) return console.error('No command argument found');

    switch (args['c']) {
        case 'get':
            if ('t' in args || 'type' in args) {
                socket.emit(`console get`, args['t'], (res) => {
                    console.log(res);
                    socket.close();
                });
                return;
            } else {
                console.log("Missing -t flag");
            }
            break;
        case 'add':
            if ('t' in args || 'type' in args) {
                if ('v' in args || 'value' in args) {
                    socket.emit(`console add`, args['t'], args['v'], (res) => {
                        console.log(res);
                        socket.close();
                    });
                    return;
                } else {
                    console.log("Missing -v flag");
                }
            } else {
                console.log("Missing -t flag");
            }
            break;
        default:
            console.error('The command was not found. Use the -? argument to get help');
            break;
    }
    socket.close();
});
socket.on('connect_error', () => {
    console.error("Connection to the server could not be established...");
    socket.close();
})

// if (!('c' in args || 'command' in args)) return console.error('No command argument found');

// switch (args['c']) {
//     case 'get':
//         if (!('t' in args || 'type' in args)) {

//         } else {
//             return console.log("Missing -t flag");
//         }
//         return console.log("Missing arguments");
//     default:
//         console.error('The command was not found. Use the -? argument to get help');
//         break;
// }