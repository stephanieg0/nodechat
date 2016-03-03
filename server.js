'use strict';

const express = require('express');
const app = express();
//socket io has to connect to native http module.
const server = require('http').createServer(app);
//pass the server to socket.io
const ws = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');

//client side available in public dir.
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

//running websockets.
ws.on('connection', socket => {
  console.log('connection', socket);
});

