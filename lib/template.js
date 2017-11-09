const handlebars = require('handlebars')

module.exports = function(today) {
  const template = handlebars.compile(`
[info][title]${today}の予定[/title]{{#each this}}{{0}}{{1}}
{{/each}}[/info]
  `)
  return template
}
