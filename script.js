// Client-side code

// all necessary tag declarations
const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');


const name = prompt('What is your name?');
appendMessage('You joined');
// automatically runs once user submits a name
socket.emit('new-user', name);

// called by the server and receives the necessary data
// to get the user's name and their message printed.
socket.on('chat-message', (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

// is called by the server after a new user is connected so that other 
// chat members can see connection. Other people connected to the 
// socket will all have this method called for themselve once the
// other member connects.
socket.on('user-connected', (name) => {
  appendMessage(`${name} connected`);
});

// is called by the server after disconnection so that other 
// chat members can see disconnection. Other people connected to the 
// socket will all have this method called for themselves once the
// other member disconnects.
socket.on('user-disconnected', (name) => {
  appendMessage(`${name} disconnected`);
});

// 'submit' event is fired when 'enter' key is clicked from the
// <input> tag OR if the Submit button is clicked (due to id name)
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

// results in text outputting to browser
function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}