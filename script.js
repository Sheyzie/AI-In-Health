const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotCloseBtn = document.getElementById('closeBot');

let userMessage;
// const API_KEY = ''

//input height
const inputInitHeight = chatInput.scrollHeight

const createChatLi = (message, type) => {
  //create chat <li> element and pass content into it
  const chatLi = document.createElement('li');
  chatLi.classList.add('chat', type);

  //add content to chat <li> element based on message type (user/bot)
  let chatContent = type === 'outgoing' ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent; //check this
  chatLi.querySelector('p').textContent = message
  return chatLi
}

//generate response from openAI
const generateResponse = (incomingChatLi) => {
  const API_URL = 'https://api.openai.com/v1/chat/completions'
  const messageElement = incomingChatLi.querySelector('p')

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: userMessage
      }
    ]
    })
  }

  //send request to OpenAI API to generate response
  fetch(API_URL, requestOptions)
    .then(res=> res.json())
    .then(data=> {
      // console.log(data)

      //check if the is a response
      if(data.choices && data.choices[0].message){
        //generate response and append to chatbox - <ul>
        messageElement.textContent = data.choices[0].message.content;
      } else {
        messageElement.textContent = 'Oops! something went wrong. Try again'
        setTimeout(() => {
          messageElement.textContent = data.error.message
        }, 1000)
      }
      // messageElement.textContent = data.choices[0].message.content;
      // messageElement.textContent = data.error.message
  })
    .catch(error=> {
      messageElement.textContent = 'Oops! something went wrong. Try again'
      console.error(error)
  }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight))
}

const handleChat = () => {
  userMessage = chatInput.value.trim(); //remove extra whitespace
  if(!userMessage) return;

  //clear previous textarea
  chatInput.value = ''

  //append user message to chatbox - <ul>
  chatbox.appendChild(createChatLi(userMessage, 'outgoing'));

  //autoscroll to chat
  chatbox.scrollTo(0, chatbox.scrollHeight)
  // chatbox.scrollTop = chatbox.scrollHeight;

  //display thinking message while waiting for response 
  setTimeout(() => {
    const incomingChatLi = createChatLi('thinking...', 'incoming')
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight)
    generateResponse(incomingChatLi);
  }, 600); //bot is thinking

}

sendChatBtn.addEventListener('click', handleChat);

chatbotToggler.addEventListener('click', () => {
  if (chatbotContainer.classList.contains('chatbot-container')){
    
    chatbotContainer.classList.remove('chatbot-container')  // remove chatbot-container class from section element to hide chatbot section when chatbot toggler is clicked again.  // chatbot-container class is added in CSS to hide chatbot section.  // chatbot-container class is defined in CSS.  // chatbot-container class is defined in CSS.  // chatbot-container class is defined in CSS.  // chatbot-container class is defined
  }else {

    chatbotContainer.classList.add('chatbot-container')
  }
})

//increase textarea height on input
// chatInput.addEventListener('input', () => {
//   chatInput.style.height = `${inputInitHeight}px`
//   chatInput.style.height = `${chatbox.scrollHeight}px`
// })

//close chatbot with close button on small screen
chatbotCloseBtn.addEventListener('click', () => {
  chatbotContainer.classList.remove('chatbot-container');
  chatbox.scrollTo(0, chatbox.scrollHeight)
})