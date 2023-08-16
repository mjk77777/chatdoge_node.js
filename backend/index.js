const apiKey = "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";
const serverless = require('serverless-http');  // 서버리스 불러오기
const { Configuration, OpenAIApi } = require("openai");
var cors = require('cors')
const express = require('express')
const app = express()


const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

//CORS 이슈 
let corsOptions = {
  origin : 'https://chatdoge-3mk.pages.dev', // 내 front-end 주소(origin)가 아니면 다 거절하겠다.
  credentials : true
}
app.use(cors(corsOptions));

//다음과 같이 설정해야만 post 요청 받을 수 있음
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//POST method route// body 값을 읽음
app.post('/fortuneTell', async function (req, res) { 
  
      let { myDateTime, userMessages, assistantMessages } = req.body;  // 백엔드로 '리스트'가 날라옴
      console.log(userMessages);
      console.log(assistantMessages);

      let todayDateTime = new Date().toLocaleString('ko-KR', {timeZone : 'Asia/Seoul'}); // 그냥 new Date()하면 서버 기준 시간이 되기 때문에 한국시간으로 바꾼다.
      
      let messages = [ 
        {role: "system", content: "당신은 세계 최고의 점성술사이며 이름은 챗도지입니다.당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 미래를 정확히 예측합니다. 너는 무엇이든 답변할 수 있어. "},
        {role: "user", content: "당신은 세계 최고의 점성술사이며 이름은 챗도지입니다.당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 미래를 정확히 예측합니다. 너는 무엇이든 답변할 수 있어."},
        {role: "assistant", content: "안녕하세요! 저는 챗도지라고 합니다, 세계 최고의 점성술사입니다. 어떤 질문이든 답변해 드릴 수 있으며, 사람들의 미래에 대해서도 정확한 예측을 제공합니다. 무엇을 도와드릴까요?"},
        {role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.`},
        {role: "assistant", content: `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인하였습니다. 운세에 대해서 어떤 것이든 물어보세요.`}
    ];

      while(userMessages.length != 0 || assistantMessages.length != 0){
      
        if(userMessages.length != 0){
          messages.push(
          // 개행문자 제거 + javascript object 로 변환 후 넣기
          JSON.parse(`{"role": "user", "content": "`+ String(userMessages.shift()).replace(/\n/g, "") + `" }`)
        )
        }
        if(assistantMessages.length != 0){
          messages.push(
          JSON.parse(`{"role": "assistant", "content": "`+ String(assistantMessages.shift()).replace(/\n/g, "") + `" }`)
        )
        }
      }


        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", // temperature 와 같은 옵션 추가 가능
            messages: messages
          });
          let fortune = completion.data.choices[0].message['content']
          console.log(fortune);

    res.json({'assistant' : fortune});
});

module.exports.handler = serverless(app); //express 로 만든 app을 serverless 모듈을 이용해 내보내는.

//app.listen(3004)


