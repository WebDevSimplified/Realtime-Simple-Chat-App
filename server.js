<<<<<<< Updated upstream
const io = require('socket.io')(3000)
=======
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => { 
  console.log(`listening on port ${PORT}`);
});
>>>>>>> Stashed changes

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
<<<<<<< Updated upstream
    socket.broadcast.emit('user-connected', name)
=======
    //post_message_data(`(${name} connected, ${Math.floor(new Date().getTime() / 1000)})`)
    socket.broadcast.emit('user-connected', name);
>>>>>>> Stashed changes
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})