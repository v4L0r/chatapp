import { useEffect, useRef, useState } from "react";
import socket from "../socket";



export default function Chat() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]); 
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const lastTimestampRef = useRef(null);

  const loadHistory = async (username) => {
    const res = await fetch(
      `http://localhost:3001/api/messages/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setMessages(data);

    if (data.length > 0) {
      lastTimestampRef.current = data[data.length - 1].createdAt;
    } else {
      lastTimestampRef.current = null;
    }
  };


  useEffect(() => {
    socket.on("new_message", (message) => {
      console.log("📩 Incoming socket message:", message);
  
      if (message.from === activeUser) {
        setMessages((prev) => [...prev, message]);
      }
    });
  


    return () => {
      socket.off("new_message");
    };
  }, [activeUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
  
      const res = await fetch("http://localhost:3001/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      setUsers(data.map((u) => u.username));
    };
  
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!activeUser) return;
  
    setMessages([]);             
    lastTimestampRef.current = null;
  
    loadHistory(activeUser);
  }, [activeUser]);


  const bottomRef= useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username;
  };

  const sendMessage = async () => {
    if (!content.trim() || !activeUser) return;

    const currentUser = getCurrentUser();

    const optimisticMessage = {
      _id: crypto.randomUUID(),
      from: currentUser,        
      to: activeUser,
      content,
      createdAt: new Date().toISOString(),
      optimistic:true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    await fetch("http://localhost:3001/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        toUsername: activeUser,
        content,
      }),
    });

    setContent("");
  };

  return (
    <div style={{ display: "flex", height: "80vh", padding: "1rem" }}>
      <div
        style={{
          width: "200px",
          borderRight: "1px solid #ccc",
          paddingRight: "1rem",
        }}
      >
        <h3>Chats</h3>
        {users.map((u) => (
          <div
            key={u}
            onClick={() => setActiveUser(u)}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              background: activeUser === u ? "#eee" : "transparent",
            }}
          >
            {u}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, paddingLeft: "1rem" }}>
        {!activeUser ? (
          <p>Select a user to start chatting</p>
        ) : (
          <>
            <h3>Chat with {activeUser}</h3>

            <div
              style={{
                border: "1px solid #ccc",
                height: "300px",
                overflowY: "auto",
                padding: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {messages.map((m) => {
                const from =
                  typeof m.from === "string" ? m.from : m.from.username;
                const to =
                  typeof m.to === "string" ? m.to : m.to.username;

                return (
                  <div key={m._id}>
                    <strong>{from}:</strong> {m.content}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <textarea
              placeholder="Type a message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: "100%", height: "60px" }}
            />

            <button onClick={sendMessage}>Send</button>
          </>
        )}
      </div>
    </div>
  );
}
