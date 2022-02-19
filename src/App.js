import React from "react";
import "./App.css";
import Pusher from "pusher-js";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import axios from "./axios";

function App() {
  const [messages, setMessages] = React.useState([]);
  React.useEffect(() => {
    axios.get("/messages/sync").then((res) => {
      setMessages(res.data);
    });
  }, []);
  React.useEffect(() => {
    var pusher = new Pusher("f887fcd4495910a78761", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("messages");
    channel.bind("inserted", function (data) {
      // alert(JSON.stringify(data));
      setMessages([...messages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  // console.log(messages);

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar />
        <Chat msg={messages} />
      </div>
    </div>
  );
}

export default App;
