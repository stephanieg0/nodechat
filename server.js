'use strict';

const app = require('express')();
//socket io has to connect to native http module.
const server = require('http').createServer(app);
//pass the server to socket.io
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('hello!!');
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

