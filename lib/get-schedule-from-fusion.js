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
  console.log(`open ${SCHEDULE_URL}`)

  await page.goto(SCHEDULE_URL)
  return await page.evaluate(() => {

    return Array.from(document.querySelectorAll('.COMMON_CALENDAR > tbody > tr'))
      .filter(tr => tr.children[0].textContent.trim())
      .reduce(aggregateSchedules, [])
      .map(({
        name,
        schedules
      }) => ({
        name,
        schedules: schedules.filter((contet => contet))
      }))

    function aggregateSchedules(array, line, index) {
      const nameColumn = line.querySelector('.LIST_CALENDAR_MEMBERS')

      if (nameColumn) {
        // 通常予定
        // 通常予定は一番目のtdにLIST_CALENDAR_MEMBERSクラスと共に予定保持者の名前が入ります。
        // 二番目のtdに当日の予定が入ります。
        array.push({
          name: nameColumn.textContent,
          schedules: parseSchedulesInOneDay(line.children[1].querySelector('td'))
        })
      } else {
        // 期間予定
        // 期間予定は、通常の予定下に追加のtr行が生成されます。
        // 当日を含む期間予定がある場合は最初のtdに、colspan 2以上と共に予定が含まれます。
        // 例:
        // <tr>
        //   <td colspan="2" bgcolor="#FFFF99"><a href="schedule_entry.asp?m=R&amp;t=u&amp;n=36202&amp;oe=list&amp;ou=29&amp;od=2017/12/7&amp;om=">休み：有給: 休暇予定</a></td>
        const firstColumn = line.children[0]
        if (firstColumn.getAttribute('colspan')) {
          array[array.length - 1].schedules.push(firstColumn.textContent)
        }
      }

      return array
    }

    function parseSchedulesInOneDay(element) {
      // 通常予定が複数ある場合は改行で区切られています。
      return element
        .innerText
        .trim()
        .split('\n')
        .map((text) => text.replace('・', ''))
    }
  })
}
