const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketio = require("socket.io");
const Immutable = require("immutable");
const { Observable } = require("rxjs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);

const io = socketio(server);

let userList = Immutable.Map({});

// socket logic on connect
const sourceConnect = Observable.create(observer => {
  io.on("connection", socket => {
    socket.emit("my socketId", {
      socketId: socket.id,
      connectTime: Date.now()
    });
    socket.on("client connect", data => {
      observer.next({ socket, data, event: "client connect" });
    });
  });
});

sourceConnect.subscribe(obj => {
  const { socketId } = obj.data;
  userList = userList.set(socketId, obj.data);
  io.emit("all users", userList.toArray());
});

// socket logic for post message
app.post("/message", (req, res) => {
  io.emit("message", req.body);
  res.send("message recieved");
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
  userList = userList.delete(obj.socketId);
  io.emit("all users", userList.toArray());
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  const name = req.body.name;
  res.send(`Hello ${name}!`);
});

// 404 error

app.use((req, res, next) => {
  const err = new Error("Sorry! route not found");
  err.status = 404;
  next(err);
});

// Internal Error handler

app.use((req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || { err: "Internal server error" });
});

server.listen(4000, () => console.log("rx-chat server running at port 4000"));
