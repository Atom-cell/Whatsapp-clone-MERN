import express, { json } from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";
const app = express();
const port = process.env.PORT || 9000;

const URL =
  "mongodb+srv://admin:B3tB8Dz2EbLcoxrf@cluster0.knx1d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(URL);

const pusher = new Pusher({
  appId: "1349841",
  key: "f887fcd4495910a78761",
  secret: "1f0146282461997a530b",
  cluster: "ap2",
  useTLS: true,
});

const db = mongoose.connection;
app.use(express.json());
app.use(cors());

db.once("open", () => {
  console.log("DB is connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    // console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("error at pusher");
    }
  });
});

app.get("/", (req, res) => {
  return res.send("hello world");
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) res.status(500).send(err);
    else {
      res.status(201).send(`new Message created: \n ${data}`);
    }
  });
});

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) res.status(500).send(err);
    else {
      res.status(200).send(data);
    }
  });
});

app.listen(port, () => {
  console.log("listening on localhost");
});

// admin
// B3tB8Dz2EbLcoxrf
