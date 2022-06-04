require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const Database = require("@replit/database");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;
const db = new Database();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", (req, res) => {
  let { url } = req.body;
  let key = Math.floor(Math.random() * 1000000);
  console.log(url);
  let pattern =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  if (url.match(pattern)) {
    db.set(`${key}`, url).then(() => {
      res.json({ original_url: url, short_url: key });
    });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:key", (req, res) => {
  let { key } = req.params;
  db.get(key).then((value) => {
    console.log(value);
    res.redirect(value);
  });
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
