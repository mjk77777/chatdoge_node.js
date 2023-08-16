// **함수 밖으로 안 빼면 계속 리스트가 새로 생겨 제대로 작동 안함
let userMessages = [];
let assistantMessages = [];  // GPT 메세지들
let myDateTime = '';

function start(){
    const date = document.getElementById('date').value;    
    const hour = document.getElementById('hour').value;

    if(date === ''){
        alert('생년월일을 입력해주세요!');
        return;
    }

    myDateTime = date + " " + hour;
   
    document.getElementById('intro').style.display = "none";
    document.getElementById('chatContainer').style.display = "block";
}


async function sendMessage() {
    const inputField = document.getElementById('messageInput');
    const message = inputField.value.trim();


    if (message !== '') {
        const chatBox = document.getElementById('chatBox');
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'sent');
        userMessage.textContent = message;
        chatBox.appendChild(userMessage);
        inputField.value = '';
    }
     // userMessage 추가
     userMessages.push(message);
     console.log("유저메세지 : " + userMessages);

     document.getElementById('loader').style.display="block";

    try {
        // ... Your existing getFortune() function code ...
        const response = await fetch('https://mazti7haona6raf43obuzqesue0izwqv.lambda-url.ap-northeast-2.on.aws/fortuneTell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // message를 서버로 보냄
            body: JSON.stringify({ 
                 myDateTime : myDateTime,   // 내가 태어난 시간 디폴트로 
                 userMessages : userMessages,
                 assistantMessages : assistantMessages
            })
        });

        const data = await response.json();

        document.getElementById('loader').style.display = "none";  // 데이터가 서버에서 도착하면 spinner 아이콘 없애기
        console.log(data);
        // assistantMessage 에 추가 (-> 서버로 다 옮김)
        assistantMessages.push(data.assistant);
        console.log("어시스터트 메세지 : " + assistantMessages)

         // Display the fortune data in the chat UI
         const chatBox = document.getElementById('chatBox');
         const fortuneMessage = document.createElement('div');
         fortuneMessage.classList.add('message', 'received');
         fortuneMessage.innerHTML = data.assistant;
         chatBox.appendChild(fortuneMessage);

        
       
    } catch (error) {
        console.error(error);
    }
       



}