const mime = require('mime');

const express = require('express');

const app = express();

const http = require('http');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)


// Important if index.html has script link to our server
app.get('/*.js', function(req, res) {
  console.log(req['url']);
  res.set('Content-Type', mime.getType(req['url']));
  res.sendFile(__dirname + req['url']);
  
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat-message', (msg) => {
        console.log('Message from User:' + msg);
        socket.broadcast.emit('chat-message', msg);
    });

    socket.on('new-user', (name) => {
        console.log(`New User Joined: ${name}`);
        socket.broadcast.emit('new-user', name);
    })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('WebSocket server running on :3000');
});
