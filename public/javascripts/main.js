const socket = io()


const clientsTotal = document.getElementById('clients')
const msgContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const msgForm = document.getElementById('message-form')
const msgInput = document.getElementById('message-input')


//Messages 
msgForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMessage()

})

socket.on('clients-total', (data)=>{
   // console.log(data)
    clientsTotal.innerText= `Total Clients : ${data}`
})

function sendMessage(){
    if(msgInput.value === '') return
    //console.log(msgInput.value)
    const data = {
        name : nameInput.value,
        Message : msgInput.value,
        date : new Date()
    }
    socket.emit('message',data)
    addMessageToUI(true,data)
    msgInput.value = ''
}

socket.on('chat-msg',(data)=>{
   // console.log(data)
    addMessageToUI(false,data)
})

function addMessageToUI(isOwnMessage,data){
    clearFeedbackMsgs()
    const element = 
    `<li class="${isOwnMessage ? "message-right" : "message-left"}">
    <p class="message">
      ${data.Message}
      <span>${data.name}⚪${data.date}</span>
    </p>
  </li>`

  msgContainer.innerHTML += element
  scrollToBottom()
}

function scrollToBottom(){
    msgContainer.scrollTo(0,msgContainer.scrollHeight)
}




//Feedback Messages
msgInput.addEventListener('focus', handleTypingEvent);
msgInput.addEventListener('keypress', handleTypingEvent);

msgInput.addEventListener('blur',(e)=>{
    socket.emit('feedback', {
        feedback : '',
    })
})

function handleTypingEvent(e) {
    socket.emit('feedback', {
      feedback: `${nameInput.value} is typing`,
    });
  }


socket.on('feedbackName',(data)=>{
  clearFeedbackMsgs()
    const element =`
     <li class="message-feedback">
    <p class="feedback" id="feedback">
      ${data.feedback}  
        </p>
  </li>`

  msgContainer.innerHTML += element
})

function clearFeedbackMsgs (){
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}


// function newUserAdded(){
//     element = `<li class="message-feedback">
//     <p class="User-added" id="User-added">
//       ${nameInput.value} is added
//     </p>
//   </li>`
// }

// socket.emit('added',{
//     added : `${nameInput.value} is added`,
// })

// socket.on('addeduser', (data)=>{
//    const element = `<li class="message-feedback">
//     <p class="User-added" id="User-added">
//       ${data.added}
//     </p>
//   </li>`

//   msgContainer.innerHTML += element

// })