const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var Filter = require('bad-words'),
filter = new Filter({ placeHolder: "_" });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // socket.broadcast.emit('hi');
    console.log("a user connected")
    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
    socket.on('chat message', (msg) => {
      io.emit('chat message', filter.clean(msg));
    });
    socket.on('console log', (msg) => {
      if (filter.isProfane(msg)) {
        console.warn(msg + " (PROFANE)")
      } else {
        console.log(msg)
      }
    })
});

server.listen(9999, () => {
  console.log('Active on port 3000');
});

// io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets