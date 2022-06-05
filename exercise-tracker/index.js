const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
});

const exerciseSchema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: String,
  userId: String,
});

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(
  process.env.MONGO_URI,
  () => console.log("MongoDB connected"),
  (err) => console.log(err)
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  let { username } = req.body;
  let newUser = new User({ username });
  await newUser.save();
  res.json(newUser);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  let { _id } = req.params;
  let user = await User.findOne({ _id });
  let { description, duration, date } = req.body;
  let newExercise = new Exercise({
    username: user.username,
    userId: _id,
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
  });
  await newExercise.save();
  res.json({
    username: user.username,
    _id: user._id,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date,
  });
});

app.get("/api/users/:_id/logs", async (req, res) => {
  let { _id } = req.params;
  let user = await User.findOne({ _id });
  let { from, to, limit } = req.query;
  let response = await Exercise.find({ userId: _id });
  if (from) {
    response = response.filter((e) => {
      let date = new Date(e.date);
      return date.getTime() >= new Date(from).getTime();
    });
  }
  if (to) {
    response = response.filter((e) => {
      let date = new Date(e.date);
      return date.getTime() <= new Date(to).getTime();
    });
  }
  if (limit) {
    response = response.slice(0, parseInt(limit));
  }
  res.json({
    username: user.username,
    _id,
    count: response.length,
    log: response.map((e) => ({
      description: e.description,
      duration: e.duration,
      date: e.date,
    })),
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Your app is listening on port http://localhost:" + listener.address().port
  );
});
