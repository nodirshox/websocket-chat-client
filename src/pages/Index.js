import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div>
      <div style={{ marginBottom: "5px" }}>
        <button onClick={() => navigate("/chats")}>Direct Messages</button>
        <button
          // onClick={() => navigate("/channels")}
          style={{ marginLeft: "10px" }}
        >
          Channels [not implemented]
        </button>
        <button
          // onClick={() => navigate("/groups")}
          style={{ marginLeft: "10px" }}
        >
          Groups [not implemented]
        </button>
      </div>
      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}

export default Index;
