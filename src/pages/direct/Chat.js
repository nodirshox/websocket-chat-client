import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../api";

function Chat() {
  const { chatId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const newSocket = io(API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    newSocket.emit("joinChat", { chatId });

    // Listen for joinChatResponse to get the initial chat history
    newSocket.on("joinChatResponse", (chat) => {
      setMessages(chat);
    });

    setSocket(newSocket);

    return () => newSocket.close();
    // eslint-disable-next-line
  }, [chatId]);

  useEffect(() => {
    if (socket) {
      socket.on("messageToClient", (messageData) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            senderId: messageData.senderId,
            message: messageData.message,
            id: messageData.id,
            seen: true,
          },
        ]);
      });

      socket.on("messageDeleted", ({ messageId }) => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== messageId)
        );
      });
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", {
        chatId,
        message,
        type: "TEXT",
      });
      setMessage("");
    }
  };

  const handleDeleteMessage = (messageId) => {
    socket.emit("deleteMessage", { messageId, chatId });
  };

  return (
    <div className="Chat">
      <h2>
        Chat{" "}
        <button
          style={{
            padding: "10px",
            marginLeft: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/chats")}
        >
          Go back
        </button>
      </h2>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <ul>
          {messages.map((msg) => (
            <li key={msg.id}>
              {msg.message}
              {msg.senderId === currentUserId && (
                <button
                  style={{
                    marginLeft: "10px",
                    padding: "5px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    color: "#ffffff",
                    backgroundColor: "red",
                  }}
                  onClick={() => handleDeleteMessage(msg.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "10px", display: "flex" }}>
        <input
          style={{ flex: 1, padding: "10px", fontSize: "16px" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button
          style={{
            padding: "10px",
            marginLeft: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>

      <div></div>
    </div>
  );
}

export default Chat;
