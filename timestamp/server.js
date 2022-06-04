// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/:date", (req, res) => {
  let { date } = req.params;
  let timestamp = Date.parse(date);
  if (isNaN(timestamp)) {
    timestamp = parseInt(date);
    if (timestamp) {
      res.json({
        unix: new Date(timestamp).getTime(),
        utc: new Date(timestamp).toUTCString(),
      });
    } else {
      res.json({
        error: "Invalid Date",
      });
    }
  } else if (isNaN(timestamp) === false) {
    res.json({
      unix: timestamp,
      utc: new Date(timestamp).toUTCString(),
    });
  } else {
    res.json({
      error: "Invalid Date",
    });
  }
});

app.get("/api", (req, res) => {
  res.json({ unix: new Date().getTime(), utc: new Date().toUTCString() });
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log(
    "Your app is listening on port " +
      "http://localhost:" +
      listener.address().port
  );
});
