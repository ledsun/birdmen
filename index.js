const postChatworkMessage = require('post-chatwork-message')
const getSchedulesFromFusion = require('./lib/get-schedule-from-fusion')
const template = require('./lib/template')
const secret = require('./secret.json')

const roomId = process.argv[2] || '18211191'
const date = new Date()
const today = `${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }`

  !(async() => {
    const result = await getSchedulesFromFusion(today)
    const formatted = template(today)(result.map(s => [s[0].padEnd(12, '　'), s[1]]))

    console.log(formatted)
    postChatworkMessage(secret.chatworkApiToken, roomId, formatted)
  })()
