const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'index.html');
});

// Will run the server on port 3000
// If you change the port make sure to change it in index.html and public/script.js
// If you plan to deply the server, you will need to change the files public/script.js and index.html to use your public IP
server.listen(3000, () => {
  console.log('listening on port 3000');
});

// Socket has has not been changed
io.on('connection', socket => {

 socket.on('joinRoom', room => {

    const user = userJoin(socket.id, room);
    socket.join(room);

    socket.on('new-user', name => {
      users[socket.id] = name
      socket.broadcast.to(user.room).emit('user-connected', name);
    })

    socket.on('send-chat-message', message => {
      socket.broadcast.to(user.room).emit('chat-message', { message: message, name: users[socket.id] });
    })

    socket.on('typing', message => {
      socket.broadcast.to(user.room).emit('typing', { message: message, name: users[socket.id] });
    })

  });

  socket.on('disconnect', () => {
    //socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id]
  })

})

const users = [];

// Join user to chat
function userJoin(id, room) {
  const user = { id, room };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}
