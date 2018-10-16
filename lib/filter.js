module.exports = function(result) {
  return result
    .filter(s => s.schedules.length)
    .map(s => Object.assign(s, {
      name: s.name.split('　')[0]
    }))
    .map(s => [s.name.padEnd(4, '　'), format(s.schedules)])
}

function format(schedules) {
  return schedules
    .map(s => s.replace('～', '-'))
    .join('\n　　　　')
}
