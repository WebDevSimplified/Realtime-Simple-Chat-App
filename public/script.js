const socket = io('http://localhost:3000')

//StackOverflow code following youtube tutorial
//Reference: https://stackoverflow.com/questions/16766488/socket-io-how-to-check-if-user-is-typing-and-broadcast-it-to-other-users

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const typing = document.getElementById('typing')
var live_message = ''

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  typing.innerHTML = ""
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

socket.on('typing', data => {
  typing.innerHTML = '<p>' + data.name + ' is typing...</p>'
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

messageInput.addEventListener('keypress', function(){
  live_message += messageInput.innerHTML
  console.log(live_message)
  socket.emit('typing', live_message)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}