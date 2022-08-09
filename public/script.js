const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
<<<<<<< Updated upstream
=======
const typing = document.getElementById('typing')
var indicator_case = 0
var live_message = ''
>>>>>>> Stashed changes

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
<<<<<<< Updated upstream
=======
  typing.innerHTML = ''
>>>>>>> Stashed changes
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

<<<<<<< Updated upstream
=======
socket.on('typing', data => {
  if (indicator_case == 1){
    typing.innerHTML = '<p>' + data.name + ' is typing...</p>'
  }
})

>>>>>>> Stashed changes
messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}