const JapaneseHolidays = require("japanese-holidays");
const getSchedulesFromFusion = require("./lib/get-schedule-from-fusion");
const secret = require("./secret.json");
const request = require("superagent");

const slackUrl = process.argv[2]
  ? secret.slackProductionUrl
  : secret.slackDevelopmentUrl;

const date = new Date();
if (JapaneseHolidays.isHoliday(date)) return;

const today = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

!(async () => {
  const result = await getSchedulesFromFusion(today);

  for (const s of result) {
    s.name = s.name.split("　")[0];
  }

  const formmattedForSlack = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${result
            .filter(({ schedules }) => schedules.length > 0)
            .map(
              ({ name, schedules }) =>
                `${name.padEnd(4, "　")}${schedules.join("\n　　　　")}`
            )
            .join("\n")}`,
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
})();
