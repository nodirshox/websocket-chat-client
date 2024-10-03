import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/direct/Chat";
import List from "./pages/direct/List";
import Index from "./pages/Index";

// Main App component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/index" element={<Index />} />
        <Route path="/chats/:chatId" element={<Chat />} />
        <Route path="/chats" element={<List />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
