const express = require('express');
const http = require('http');

const app = express();
server = http.createServer(app);

app.get('/', (req, res) => res.send("Hello World!"));

app.listen(28569);