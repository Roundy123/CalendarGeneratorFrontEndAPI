var express = require("express");
var app = express();
var cors = require("cors");
const PORT = process.env.PORT || 4001;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Pusher = require("pusher");
const bodyParser = require("body-parser");
const url =
  "mongodb+srv://admin:sdfoij3453798@cluster0-keugv.mongodb.net/test?retryWrites=true&w=majority";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const pusher = new Pusher({
  appId: "1027167",
  key: "656d577c7e59c011ff9f",
  secret: "88a675e752e2df5c3331",
  cluster: "eu",
  encrypted: true,
});

app.get("/pusher", (req, res) => {
  const payload = req.body;
  pusher.trigger("my-channel", "updateapicalls", {
    message: "hello world",
  });
  res.send(payload);
});

mongoose.connect(url, { useNewUrlParser: true });

let db = mongoose.connection;

db.once("open", (_) => {
  console.log("Database connected:", url);
});

db.on("error", (err) => {
  console.error("connection error:", err);
});

const usageSchema = new Schema({
  apiCalls: Number,
  usersOnline: Number,
});

const Usage = mongoose.model("Usage", usageSchema);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/url", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.get("/getapicalls", (req, res) => {
  Usage.findById({ _id: "5ef7a43ac791fe03e8d05f0f" }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/updateapicalls", (req, res) => {
  Usage.findByIdAndUpdate(
    { _id: "5ef7a43ac791fe03e8d05f0f" },
    { $inc: { apiCalls: 1 } },
    { new: true },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
        pusher.trigger("my-channel", "updateapicalls", result);
      }
    }
  );
});

app.post("/addusersonline", (req, res) => {
  Usage.findByIdAndUpdate(
    { _id: "5ef7a43ac791fe03e8d05f0f" },
    { $inc: { usersOnline: 1 } },
    { new: true },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
        pusher.trigger("my-channel", "updateusersonline", result);
      }
    }
  );
});

app.post("/removeusersonline", (req, res) => {
  Usage.findByIdAndUpdate(
    { _id: "5ef7a43ac791fe03e8d05f0f" },
    { $inc: { usersOnline: -1 } },
    { new: true },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
        pusher.trigger("my-channel", "updateusersonline", result);
      }
    }
  );
});
