var express = require("express");
var app = express();
var cors = require("cors");
const PORT = process.env.PORT || 4001;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const url =
  "mongodb+srv://admin:sdfoij3453798@cluster0-keugv.mongodb.net/test?retryWrites=true&w=majority";

app.use(cors());

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
  console.log("Server running on port 3000");
});

app.get("/url", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.get("/updateapicalls", (req, res) => {
  Usage.findByIdAndUpdate(
    { _id: "5ef7a43ac791fe03e8d05f0f" },
    { $inc: { apiCalls: 1 } },
    { new: true },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});
