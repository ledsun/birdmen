const JapaneseHolidays = require('japanese-holidays')
const postChatworkMessage = require('post-chatwork-message')
const getSchedulesFromFusion = require('./lib/get-schedule-from-fusion')
const template = require('./lib/template')
const filter = require('./lib/filter')
const secret = require('./secret.json')

const roomId = process.argv[2] || '173667622'

const date = new Date()
if(JapaneseHolidays.isHoliday(date)) return

const today = `${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }`

  !(async () => {
    const result = await getSchedulesFromFusion(today)
    const formatted = template(today)(filter(result))

    console.log(formatted)
    postChatworkMessage(secret.chatworkApiToken, roomId, formatted)
  })()
