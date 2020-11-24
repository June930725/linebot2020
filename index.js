// 參考 https://www.npmjs.com/package/linebot 的 Usage 輸入
// import 一定要放在檔案最上面，為nodejs規定
// 引用 line 機器人套件
import linebot from 'linebot'
// 引用 dotenv 環境設定套件
import dotenv from 'dotenv'
// 引用 axios 套件
import axios from 'axios'
// 引用 cheerio 套件
import cheerio from 'cheerio'
// 引用 camp
import camp from './camp.js'
// 引用 fs 套件 (Node.js內建讀寫套件)
// import fs from 'fs'
// 引用 Node Schedule 套件
// 等使用者查詢才去扒網站，用不到但可以學個 ㄏ
// import schedule from 'node-schedule'

// 讀取 .env
dotenv.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 測試用
// bot.on('message', async event => {
//   console.log(event.message.text)
//   event.reply(event.message.text)
// }

bot.on('message', async event => {
  try {
    if (event.message.type === 'text') {
      // const user = event.source.userId
      // console.log(`使用者 ID: ${user}`)
      const city = event.message.text // 使用者輸入進來的東西
      const response = await axios.get(camp[city]) // 也可以這樣寫!
      const $ = cheerio.load(response.data) // 載入 cheerio
      // const url = camp[city]
      // console.log(camp[city]) // 取得到輸入縣市的網址
      // const reply = url // camp[city] // 設定回覆的值
      // 取得網址後開始去抓該網頁內所需要的資料
      // 抓取營地名稱
      const campplace = ''
      const flex = {
        type: 'flex',
        altText: `Camppy 查詢 ${campplace} 的結果`,
        contents: {
          type: 'carousel',
          contents: []
        }

      }
      for (let i = 0; i < $('.col-md-6.col-sm-12.col-xs-12').length; i++) {
        console.log($('.col-md-6.col-sm-12.col-xs-12 h3').eq(i).text())
        const campplace = $('.col-md-6.col-sm-12.col-xs-12 h3').eq(i).text()
        const introduce = $('.col-md-6.col-sm-12.col-xs-12 .allcamp-info').eq(i).text().trim()
        const pic = $('.col-md-6.col-sm-12.col-xs-12 .thumbnail img').eq(i).attr('src')
        const id = $('.col-md-6.col-sm-12.col-xs-12 h3 a').eq(i).attr('href')
        console.log('https://www.easycamp.com.tw/' + id)
        const web = ('https://www.easycamp.com.tw/' + id)
        if (flex.contents.contents.length < 10) {
          flex.contents.contents.push(
            {
              type: 'bubble',
              size: 'micro',
              hero: {
                type: 'image',
                url: pic,
                size: 'full',
                aspectMode: 'cover',
                aspectRatio: '320:213'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: campplace,
                    weight: 'bold',
                    size: 'sm'
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: introduce || '等待更新',
                            wrap: true,
                            color: '#8c8c8c',
                            size: 'xs',
                            flex: 0
                          }
                        ]
                      }
                    ]
                  }
                ],
                spacing: 'sm',
                paddingAll: '13px'
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'button',
                    height: 'sm',
                    style: 'primary',
                    // color: '#29235c',
                    color: '#3e396c',
                    action: {
                      type: 'uri',
                      label: '營區資訊介紹',
                      uri: web
                    }
                  }
                ]
              }
            })
        }
      }
      event.reply(flex) // 設定回復才會回喔
      // 要測試再打開下面的 fs.writeFile
      // fs.writeFile('./test.json', JSON.stringify(flex), () => { })
    }
    // reply = (reply.length === 0) ? '找不到資料' : reply
    // event.reply(reply)
  } catch (error) {
    event.reply('輸入錯誤，請輸入想查詢的縣市名稱！（例如：台北、新北、桃園…）')
    console.log(error)
  }
})

// bot.push((userId, message), async event => {

// })

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
