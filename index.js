// 參考 https://www.npmjs.com/package/linebot 的 Usage 輸入
// import 一定要放在檔案最上面，為nodejs規定
// 引用 line 機器人套件
import linebot from 'linebot'
// 引用 dotenv 環境設定套件
import dotenv from 'dotenv'
// 引用 axios 套驗
import axios from 'axios'

// 讀取 .env
dotenv.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async event => {
  try {
    const response = await axios.get('https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6')
    const text = event.message.text
    let reply = ''
    for (const data of response.data) {
      if (data.title === text) {
        reply = data.showInfo[0].locationName
        break
      }
    }
    reply = (reply.length === 0) ? '找不到資料' : reply
    event.reply(reply)
  } catch (error) {
    event.reply('發生錯誤')
  }
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})