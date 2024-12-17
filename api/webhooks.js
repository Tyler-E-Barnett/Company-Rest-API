require("dotenv").config();
const { Router } = require("express");
const axios = require("axios");

const webhooksRouter = Router();

webhooksRouter.post("/DJ/general", async (req, res) => {
  console.log(req.body);
  const { staffEmail, staffName, notes, time, facility, jobNumber } = req.body;

  const formatted_Card_Payload = {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          type: "AdaptiveCard",
          body: [
            {
              type: "TextBlock",
              size: "Medium",
              weight: "Bolder",
              text: "Important Note",
            },
            {
              type: "TextBlock",
              text: `For <at>${staffName}</at>`,
            },
            {
              type: "TextBlock",
              text: `Job Number: ${jobNumber}`,
            },
            {
              type: "TextBlock",
              text: `Facility: ${facility}`,
            },
            {
              type: "TextBlock",
              text: `Time: ${time}`,
            },
            {
              type: "TextBlock",
              size: "Medium",
              text: `Note: ${notes}`,
              wrap: "true",
            },
          ],
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          version: "1.0",
          msteams: {
            entities: [
              {
                type: "mention",
                text: `<at>${staffName}</at>`,
                mentioned: {
                  id: staffEmail,
                  name: staffName,
                },
              },
            ],
          },
        },
      },
    ],
  };

  const webhookUrl = process.env.DJ_ALERT_WEBHOOK_URL;

  try {
    const result = await axios.post(webhookUrl, formatted_Card_Payload);
    console.log(result);
    res.status(200).send("success");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

webhooksRouter.post("/eventsJobs/jobChange", async (req, res) => {
  console.log(req.body);
  const { jobId, information, date, jobDate, time, account, location } =
    req.body;

  const formatted_Card_Payload = {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          type: "AdaptiveCard",
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          version: "1.3",
          body: [
            {
              type: "TextBlock",
              size: "Large",
              weight: "Bolder",
              text: "Job Update Notification",
              horizontalAlignment: "Center",
              color: "Attention",
              separator: true,
              spacing: "Medium",
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Job Number:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: jobId,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Job Date:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: `${jobDate}`,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Date Entered:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: `${date} ${time}`,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Location:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: location,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "From:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: account,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "TextBlock",
              text: `Note: ${information}`,
              wrap: true,
              spacing: "Medium",
              separator: true,
            },
          ],
        },
      },
    ],
  };

  const webhookUrl = process.env.JOBCHANGE_WEBHOOK_URL;

  try {
    const result = await axios.post(webhookUrl, formatted_Card_Payload);
    console.log(result);
    res.status(200).send("SUCCESS");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

webhooksRouter.post("/eventsJobs/buzzBoard", async (req, res) => {
  console.log(req.body);
  const { jobId, information, date, jobDate, time, account, location } =
    req.body;

  const formatted_Card_Payload = {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          type: "AdaptiveCard",
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          version: "1.3",
          body: [
            {
              type: "TextBlock",
              size: "Large",
              weight: "Bolder",
              text: "Job Update Notification",
              horizontalAlignment: "Center",
              color: "Attention",
              separator: true,
              spacing: "Medium",
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Job Number:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: jobId,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Job Date:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: `${jobDate}`,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Date Entered:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: `${date} ${time}`,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Location:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: location,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "From:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: account,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "TextBlock",
              text: `Note: ${information}`,
              wrap: true,
              spacing: "Medium",
              separator: true,
            },
          ],
        },
      },
    ],
  };

  const webhookUrl = process.env.BUZZBOARD_WEBHOOK_URL;

  try {
    const result = await axios.post(webhookUrl, formatted_Card_Payload);
    console.log(result);
    res.status(200).send("SUCCESS");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

webhooksRouter.post("/crew/run", async (req, res) => {
  const {
    runNumber,
    information,
    date,
    runDate,
    time,
    account,
    crew,
    location,
    sharepointLink,
    vehicles,
  } = req.body;

  const crewMentionsText = crew
    .map((member, index) => `<at>${member.name}</at>`)
    .join(", ");

  const formatted_Card_Payload = {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          type: "AdaptiveCard",
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          version: "1.3",
          body: [
            {
              type: "TextBlock",
              size: "Large",
              weight: "Bolder",
              text: "Run Information",
              horizontalAlignment: "Center",
              color: "Attention",
              separator: true,
              spacing: "Medium",
            },
            {
              type: "TextBlock",
              text: `Crew: ${crewMentionsText}`, // Text including <at> mentions
              wrap: true,
              spacing: "Medium",
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Run Number:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [{ type: "TextBlock", text: runNumber, wrap: true }],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Run Date:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    { type: "TextBlock", text: `${runDate}`, wrap: true },
                  ],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Date Entered:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    { type: "TextBlock", text: `${date} ${time}`, wrap: true },
                  ],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Location:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [{ type: "TextBlock", text: location, wrap: true }],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Vehicles:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [{ type: "TextBlock", text: vehicles, wrap: true }],
                },
              ],
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "From:",
                      weight: "Bolder",
                      wrap: true,
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [{ type: "TextBlock", text: account, wrap: true }],
                },
              ],
            },
            {
              type: "TextBlock",
              text: `Notes: ${information}`,
              wrap: true,
              spacing: "Medium",
              separator: true,
            },
            {
              type: "ActionSet",
              actions: [
                {
                  type: "Action.OpenUrl",
                  title: "Crew Paperwork",
                  url: sharepointLink, // The URL for the SharePoint link
                },
              ],
            },
          ],
          msteams: {
            entities: crew.map((member, index) => ({
              type: "mention",
              text: `<at>${member.name}</at>`, // Matches the <at> tag in the text
              mentioned: {
                id: member.id, // The UPN or email address for tagging
                name: member.name, // Display name
              },
            })),
          },
        },
      },
    ],
  };

  const webhookUrl = process.env.CREW_RUN_WEBHOOK_URL;

  try {
    const result = await axios.post(webhookUrl, formatted_Card_Payload);
    console.log(result.data);
    res.status(200).send("SUCCESS");
  } catch (error) {
    console.error(
      "error sending crew information to channel with webhook",
      error.response.data.error
    );
    res.status(500).send(error.message);
  }
});

module.exports = { webhooksRouter };
