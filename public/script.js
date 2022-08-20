const socket = io()

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const typing = document.getElementById('typing')

var keypressed_timestamped = ''
var indicator_case = 3


const name = prompt('What is your name?')
appendMessage(`${name} joined`)
//post_message_data(`(${name} connected, ${Math.floor(new Date().getTime() / 1000)})`)
socket.emit('new-user', name)


//Message received with recipient name
socket.on('chat-message', data => {
  typing.innerHTML = ''
  appendMessage(`${data.name}: ${data.message}`)
})

//Shows when other people connect
socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

//Shows when other people disconnect
socket.on('user-disconnected', name => {
  //post_message_data(`(${name} disconnected, ${Math.floor(new Date().getTime() / 1000)})`)
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

//Message sent by sender - call API 
messageForm.addEventListener('submit', e => {
  e.preventDefault()
  
  post_message_data(keypressed_timestamped)
  keypressed_timestamped = ''
  
  const message = messageInput.value
  appendMessage(`${name}: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

messageInput.addEventListener('input', function(e){
  socket.emit('typing', messageInput.value)
})

//Keys pressed by the sender - concatenate keys/events 
messageInput.addEventListener('keyup', function(e){
  keypressed_timestamped += `(${e.key}, ${Math.floor(new Date().getTime() / 1000)})`
  //appendMessage(keypressed_timestamped)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function post_message_data(log_event){
  var url = "https://nhipj3fca6.execute-api.us-east-1.amazonaws.com/dev/message"
  var data = {
      "messages": {
          "chat_uuid" : "3b547d64-5c37-4f97-a7e2-4254bd9f06d0",
          "chat_name" : "front-end-version-2",
          "sender_uuid" : "15d18e55-f3c0-476b-bc05-ec12bc36780d",
          "receiver_uuid" : "f9748683-99f2-4246-b069-7f001ff1b3a4",
          "message_text" : log_event
      }
  }

  fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'Accept' : '*/*',
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      //appendMessage('sccess')
    })
    .catch((error) => {
      console.error('Error:', error);
      //appendMessage('error')
    });
}