const JapaneseHolidays = require("japanese-holidays");
const getSchedulesFromFusion = require("./lib/get-schedule-from-fusion");
const secret = require("./secret.json");
const request = require("superagent");

const slackUrl = process.argv[2]
  ? secret.slackProductionUrl
  : secret.slackDevelopmentUrl;

const date = new Date();
if (JapaneseHolidays.isHolidayAt(date)) return;

const today = `${date.getFullYear()}/${
  date.getMonth() + 1
}/${JapaneseHolidays.getJDate(date)}`;

!(async () => {
  const result = await getSchedulesFromFusion(today);
  const schedules = result.filter(({ schedules }) => schedules.length > 0);

  if (schedules.length) {
    const text = `${schedules
      .map(
        ({ name, schedules }) =>
          `${name.split("　")[0].padEnd(4, "　")}${schedules.join(
            "\n　　　　"
          )}`
      )
      .join("\n")}`;

    const formmattedForSlack = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text,
          },
        },
      ],
    };

    console.log(JSON.stringify(formmattedForSlack, null, 2));

    request
      .post(slackUrl)
      .set("Content-type", "application/json")
      .send(formmattedForSlack)
      .end((err, res) => {
        if (err) {
          console.log(err, res);
        }
      });
  } else {
    console.log(`There is no schedules at ${today}.`);
  }
})();
