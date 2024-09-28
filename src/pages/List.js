import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

function List() {
  const [chats, setChats] = useState([]);
  const [newChatUsername, setNewChatUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of chats when the page loads
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchChats = async () => {
      try {
        const response = await fetch(`${API_URL}/chats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const chats = await response.json();
          setChats(chats.data);
        } else {
          setError("Failed to load chats.");
        }
      } catch (err) {
        setError("An error occurred while fetching chats.");
      }
    };

    fetchChats();
  }, []);

  const handleCreateChat = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!newChatUsername.trim()) {
      setError("Please enter a username.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newChatUsername }),
      });

      if (response.ok) {
        const chat = await response.json();
        navigate(`/chat/${chat.id}`);
      } else {
        setError("Failed to create chat.");
      }
    } catch (err) {
      setError("An error occurred while creating the chat.");
    }
  };

  return (
    <div>
      <h2>Your Chats</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} onClick={() => navigate(`/chats/${chat.id}`)}>
            Chat with {chat.username}
          </li>
        ))}
      </ul>

      <h3>Create a New Chat</h3>
      <div>
        <input
          type="text"
          placeholder="Enter username"
          value={newChatUsername}
          onChange={(e) => setNewChatUsername(e.target.value)}
        />
        <button onClick={handleCreateChat}>Create Chat</button>
      </div>
    </div>
  );
}

export default List;
