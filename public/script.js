const socket = io('http://localhost:3000')

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const typing = document.getElementById('typing')
var live_message = ''

const room = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const indicator_case = room.room;

// Join chatroom
socket.emit('joinRoom', room.room);

if (messageForm != null) {

  const name = prompt('What is your name?')
  appendMessage('You joined')
  socket.emit('new-user', name)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`${name}: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
  })
}

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
  if (data.message.length == 0 || indicator_case == 'Chat'){
     typing.innerHTML = ''
   }
  else {
    if (indicator_case == 'Chat1'){
      typing.innerHTML = '<p>' + data.name + ' is typing...</p>'
    }
    else if (indicator_case == 'Chat2'){
      typing.innerHTML = `<p>${data.name}: ${data.message}...</p>`
    }
    else if (indicator_case == 'Chat3'){
      typing.innerHTML = `<p>${data.name}: ${data.message.replace(/\S/g, "#")}...</p>`
    }
  }
})

messageInput.addEventListener('input', function(){
  socket.emit('typing', messageInput.value)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

