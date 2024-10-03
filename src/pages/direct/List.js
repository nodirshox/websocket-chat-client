import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api";

function List() {
  const [chats, setChats] = useState([]);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchChats = async () => {
      try {
        const response = await fetch(`${API_URL}/chats?type=DIRECT`, {
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

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.data);
        } else {
          setError("Failed to load user info.");
        }
      } catch (err) {
        setError("An error occurred while fetching user info.");
      }
    };

    fetchUserInfo();
    fetchChats();
    // eslint-disable-next-line
  }, []);

  const handleCreateChat = async () => {
    if (username.length === 0) {
      alert("Enter username");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/chats/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setChats(data.data);
        navigate(`/chats/${data.id}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching chat");
    }
  };

  return (
    <div>
      {user && <h2>Hi, {user.username}</h2>}

      <h2>Chats</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {chats.map((chat) => (
          <li key={chat.chatId}>
            {chat.user.username}{" "}
            <button onClick={() => navigate(`/chats/${chat.chatId}`)}>
              Chat
            </button>
          </li>
        ))}
      </ul>

      <h3>Create a New Chat</h3>
      <div>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleCreateChat}>Create Chat</button>
      </div>
      <button onClick={() => navigate("/index")} style={{ marginTop: "20px" }}>
        Back
      </button>
    </div>
  );
}

export default List;
