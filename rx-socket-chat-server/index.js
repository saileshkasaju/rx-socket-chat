const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const Immutable = require("immutable");
const { Observable } = require("rxjs");

const app = express();

app.use(bodyParser.json());

const server = http.createServer(app);

const io = socket(server);

const userList = Immutable.Map({});

// socket logic on connect
const sourceConnect = Observable.create(observer => {
  io.on("connection", socket => {
    socket.emit("my socketId", {
      socketId: socket.id,
      connectTime: Date.now()
    });
  });

  io.on("client connect", data => {
    observer.next({ socket: socket, data: data, event: "client connect" });
  });
});

sourceConnect.subscribe(obj => {
  userList.set(obj.data.socketId, obj.data);
  io.emit("all users", userList.toArray());
});

// socket logic for post message
app.post("/message", (req, res) => {
  io.emit("message", req.body);
  res.send(`message sent`);
});

// socket logic for disconnect

const sourceDisconnect = Observable.create(observer => {
  io.on("connection", socket => {
    socket.on("disconnect", data => {
      observer.next({ socketId: socket.id, event: "client disconnect" });
    });
  });
});

sourceDisconnect.subscribe(obj => {
  userList.delete(obj.socketId);
  io.emit("all users", userList.toArray());
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  const name = req.body.name;
  res.send(`Hello ${name}!`);
});

server.listen(4000, () => console.log("rx-chat server running at port 4000"));
