import React from "react";
import format from "date-fns/format";
import axios from "axios";

class ChatPanel extends React.Component {
  state = { message: "" };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });
  sendMessage = e => {
    e.preventDefault();
    const { message } = this.state;
    if (message) {
      axios
        .post("http://localhost:4000/message", {
          message,
          who: this.props.nickname,
          timestamp: Date.now()
        })
        .then(() => this.setState({ message: "" }));
    }
  };
  render() {
    const { message } = this.state;
    const { nickname, messages } = this.props;
    return (
      <div>
        <h4>Your nickname is {nickname}</h4>
        <ul className="collection">
          {messages.map(message => (
            <li
              className={`collection-item ${
                nickname === message.who ? "right" : ""
              }`}
              key={message.timestamp}
            >
              <span className="title">
                {message.who}
                <i>
                  {format(
                    parseInt(message.timestamp, 10),
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                </i>
              </span>
              <p>
                <strong>{message.message}</strong>
              </p>
            </li>
          ))}
        </ul>
        <form className="row" onSubmit={this.sendMessage}>
          <div className="input-field col s10">
            <input
              type="text"
              id="message-input"
              name="message"
              value={message}
              onChange={this.handleChange}
            />
            <label htmlFor="message-input" className="active">
              Enter message here
            </label>
            <button
              id="sendBtn"
              type="submit"
              className="btn-floating btn-large waves-effect waves-light red"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ChatPanel;
