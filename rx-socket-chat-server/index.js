const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socket = require("socket.io");

const app = express();

app.use(bodyParser.json());

const server = http.createServer(app);

const io = socket(server);

// socket logic on connect

// socket logic for post message
app.post("/message", (req, res) => {
  io.emit("message", req.body);
  res.send(`message sent`);
});

// socket logic for disconnect

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  const name = req.body.name;
  res.send(`Hello ${name}!`);
});

server.listen(4000, () => console.log("rx-chat server running at port 4000"));
