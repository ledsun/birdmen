const puppeteer = require('puppeteer')
const secret = require('../secret.json')

module.exports = async function(today) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })

  try {
    const page = await browser.newPage()
    await login(page)
    const result = await getSchedules(page, today)
    return result
  } catch (e) {
    console.error(e)
  } finally {
    browser.close()
  }
}

async function login(page) {
  const LOGIN_URL = 'https://workflow.luxiar.jp/10_luxiar/sys/login.asp'

  await page.goto(LOGIN_URL)
  await page.evaluate((secret) => {
    document.querySelector('#USER_ID')
      .value = secret.fusionId
    document.querySelector('#PASSWORD')
      .value = secret.fusionPassword
    document.querySelector('[type="button"')
      .click()
  }, secret)
  await page.waitForNavigation()
}

async function getSchedules(page, date) {
  // 日付は0埋めしなくても通ります。
  const SCHEDULE_URL = `https://workflow.luxiar.jp/10_luxiar/sys/schedule_list.asp?ev=list&u=29&g=53&d=${ date }`

  await page.goto(SCHEDULE_URL)
  const result = await page.evaluate(() => {
    function parseDailySchedule(element) {
      return element
        .innerText
        .trim()
        .split('\n')
        .map((text) => text.replace('・', ''))
    }

    return Array.from(document.querySelectorAll('.COMMON_CALENDAR > tbody > tr'))
      .filter(tr => tr.children[0].textContent.trim())
      .map(tr => [tr.children[0].textContent, parseDailySchedule(tr.children[1].querySelector('td'))])
  })
  return result
}
