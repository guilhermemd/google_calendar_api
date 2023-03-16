const express = require("express");
const { google } = require("googleapis");
const axios = require("axios");
require("dotenv").config();
const dayjs = require("dayjs");

const app = express();

const PORT = process.env.NODE_ENV || 8000;

const calendar = google.calendar({
  version: "v3",
  auth: process.env.API_KEY,
});
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = ["https://www.googleapis.com/auth/calendar"];

app.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url);
});

app.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  // console.log("Respostaaaaa", req.query.code);
  // console.log("tokens", await oauth2Client.getToken(code));
  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  res.send({
    msg: "You have successfully logged in",
  });
});

app.get("/schedule_event", async (req, res) => {
  // console.log("acess_toke", oauth2Client.credentials.access_token);
  await calendar.events.insert({
    calendarId: "primary",
    auth: oauth2Client,
    requestBody: {
      summary: "This is a test event",
      description: "Some event that is very impotant",
      start: {
        dateTime: dayjs(new Date()).add(1, "day").toISOString(),
        timeZone: "Brazil/East",
      },
      end: {
        dateTime: dayjs(new Date()).add(1, "day").add(1, "hour").toISOString(),
        timeZone: "Brazil/East",
      },
    },
  });
  res.send({
    msg: "Done",
  });
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
