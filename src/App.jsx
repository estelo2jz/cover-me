// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Admin from "./pages/Admin";
import UserDashboard from "./pages/UserDashboard";
import CreateGroupPage from "./pages/CreateGroupPage";
import "./App.scss";

const App = () => {
  const [currentUser, setCurrentUser] = useState("You");

  return (
    <Router>
      <div className="app">
        <header className="app__header">
          <h1>💰Cover Me</h1>
          <nav className="app__nav">
            <Link to="/">Home</Link>
            <Link to="/create">Create Group</Link>
            <Link to="/my-groups">My Groups</Link>
            <Link to="/admin">Admin</Link>

          </nav>
        </header>

        <main className="app__main">
          <Routes>
            <Route path="/" element={<Dashboard currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
            <Route path="/my-groups" element={<UserDashboard currentUser={currentUser} />} />
            <Route path="/create" element={<CreateGroupPage currentUser={currentUser} />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
