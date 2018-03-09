const handlebars = require('handlebars')

module.exports = function(today) {
  const template = handlebars.compile(`
[info][title]${today}の予定[/title]{{#each this}}{{0}}{{1}}
{{/each}}[/info]この通知が参考になった方は、次のリンクをクリックしてください
https://script.google.com/macros/s/AKfycbwRCiJBwOMxsCJMvg87cwAEc2ghNVH6tH5Th-gSwuL9s6OqtNMo/exec?vote=good
役に立たなかった方は、次のリンクをクリックしてください
https://script.google.com/macros/s/AKfycbwRCiJBwOMxsCJMvg87cwAEc2ghNVH6tH5Th-gSwuL9s6OqtNMo/exec?vote=bad
  `)
  return template
}
