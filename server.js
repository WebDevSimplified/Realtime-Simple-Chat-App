// Server-side code
const io = require('socket.io')(3000);

const users = {};

io.on('connection', (socket) => {
  // called by client once a name has been submitted by new user 
  // after connection
  socket.on('new-user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });
  
  // called by client to get the name of the user sending the message
  // so that it can be printed together by the client
  socket.on('send-chat-message', (message) => {
    socket.broadcast.emit('chat-message', { 
      message: message, 
      name: users[socket.id] 
    });
  });

  // when the user decides to disconnect their connection to the server, 
  // this event runs
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
})