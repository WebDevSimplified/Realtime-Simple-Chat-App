const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');

function appendMessage(msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}


const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)


socket.on('chat-message', data => {
  appendMessage(`${data}`);  
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`);
});

socket.on('new-user', name => {
  appendMessage(`${name} joined`);
});


socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const message = input.value;
  appendMessage(`You: ${message}`);
  socket.emit('chat-message', message);
  input.value = '';
});