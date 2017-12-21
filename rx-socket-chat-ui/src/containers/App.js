import React from "react";
import io from "socket.io-client";
import { Observable } from "rxjs/Observable";
import generateNickname from "../utils/generateNickname";
import AppBar from "../components/AppBar";
import UserList from "../components/UserList";
import ChatPanel from "./ChatPanel";

class App extends React.Component {
  state = {
    userList: [],
    messages: [],
    nickname: ""
  };

  componentDidMount() {
    const socket = io("http://localhost:4000");

    const socketIdStream = Observable.create(observer => {
      socket.on("my socketId", data => {
        observer.next(data);
      });
    });

    socketIdStream.subscribe(data => {
      const nickname = generateNickname();
      socket.emit("client connect", {
        nickname,
        socketId: data.socketId,
        connectTime: data.connectTime
      });
      this.setState({ nickname });
    });

    const socketAllUserStream = Observable.create(observer => {
      socket.on("all users", data => {
        observer.next(data);
      });
    });

    socketAllUserStream.subscribe(data => {
      this.setState({ userList: Object.assign([], data) });
    });

    const socketMessageStream = Observable.create(observer => {
      socket.on("message", data => {
        console.log("got a message", data);
        observer.next(data);
      });
    });

    socketMessageStream.subscribe(data => {
      this.setState({ messages: [...this.state.messages, data] });
    });
  }

  render() {
    const { messages, userList, nickname } = this.state;
    return (
      <div>
        <AppBar />
        <div className="row">
          <div className="col s6">
            <ChatPanel nickname={nickname} messages={messages} />
          </div>
          <div className="col s6">
            <UserList userList={userList} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
