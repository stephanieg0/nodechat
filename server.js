'use strict';

const express = require('express');
const app = express();
const pg = require('pg').native;
//socket io has to connect to native http module.
const server = require('http').createServer(app);
//pass the server to socket.io
const ws = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

//database url
const POSTGRES_URL = process.env.POSTGRES_URL || 'postgres://localhost:5432/nodechat';

//singleton that I can pass around and share.
const db = new pg.Client(POSTGRES_URL);

app.set('view engine', 'jade');

//client side available in public dir.
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

//routes only job is to send this query.
app.get('/chats', (req, res) => {
  db.query('SELECT * FROM chats', (err, result) => {
    if (err) throw err;

    res.send(result.rows);
  });

});

//connecting to database and wrapping listeting port.
db.connect((err) => {
  if (err) throw err;

  server.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });

});


//running websockets.
ws.on('connection', socket => {
  console.log('socket connected');

  db.query('SELECT * FROM chats', (err, result) => {
    if (err) throw err;

  socket.emit('receiveChat', result.rows);//emits to one socket
  //ws.emit emits to all sockets.
  });


  //listeting to an individual socket sent by client side.
  socket.on('sendChat', msg => {
    //emitting a second event.
    //ws.emit('receiveChat', msg);

    //database insert before broadcasting the event.
    db.query(`INSERT INTO chats (name, text)
      VALUES ($1, $2)`, [msg.name, msg.text], (err) => {
        if (err) throw err;

        //emittin the event to everyone exept this socket so chat does not appear twice.
        socket.broadcast.emit('receiveChat', [msg]);//senging an array.
    });
  });
});

