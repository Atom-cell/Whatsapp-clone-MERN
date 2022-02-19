import React from "react";
import { AttachFile } from "@mui/icons-material";
import MoreVert from "@mui/icons-material/MoreVert";
import Search from "@mui/icons-material/Search";
import { Avatar, IconButton } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import axios from "./axios";

import "./Chat.css";

const Chat = ({ msg }) => {
  const [input, setInput] = React.useState("");
  const sendMsg = async (e) => {
    e.preventDefault();

    await axios
      .post("/messages/new", {
        message: input,
        name: "DEMO",
        timestamp: "Just now!",
        received: true,
      })
      .then((res) => console.log(res))
      .catch(function (error) {
        console.log(error);
      });

    setInput("");

    // alert(input);
  };
  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar />
        <div className="chat_headerInfo">
          <h3>Room name</h3>
          <p>Last seen at...</p>
        </div>

        <div className="chat_headerRight">
          <IconButton>
            <Search />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {msg.map((m) => {
          return (
            <p className={`chat_message ${m.received && "chat_receiver"}`}>
              <span className="chat_name">{m.name}</span>
              {m.message}
              <span className="chat_timestamp">{m.timestamp}</span>
            </p>
          );
        })}
      </div>

      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMsg} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default Chat;
