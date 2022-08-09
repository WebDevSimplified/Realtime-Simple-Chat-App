const socket = io('http://localhost:3000')

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const typing = document.getElementById('typing')
var indicator_case = 3
var live_message = ''

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  typing.innerHTML = ''
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

socket.on('typing', data => {
  if (data.message.length == 0 || indicator_case == 0){
     typing.innerHTML = ''
   }
  else {
    if (indicator_case == 1){
      typing.innerHTML = '<p>' + data.name + ' is typing...</p>'
    }
    else if (indicator_case == 2){
      typing.innerHTML = `<p>${data.name}: ${data.message}...</p>`
    }
    else if (indicator_case == 3){
      typing.innerHTML = `<p>${data.name}: ${data.message.replace(/\S/g, "#")}...</p>`
    }
  }
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`${name}: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

messageInput.addEventListener('input', function(){
  socket.emit('typing', messageInput.value)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}