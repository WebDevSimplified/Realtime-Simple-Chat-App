const express = require('express')
const app = express();
const port = process.env.PORT || 8000;
const path =require('path')
const http = require('http');
const server = http.createServer(app);
const Server = require('socket.io')
//import { Server } from "socket.io";

const io = new Server(server);



app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index1.html'));
});

io.on('connection', (socket) => {
   console.log('a user connected');
   socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
  });

app.listen(port);
console.log('Server started at localhost ' + port);
