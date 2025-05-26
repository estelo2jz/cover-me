// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Admin from "./pages/Admin";
import UserDashboard from "./pages/UserDashboard";
import CreateGroupPage from "./pages/CreateGroupPage";
import Navigation from "./components/Navigation/Navigation";
import "./App.scss";

const App = () => {
  const [currentUser, setCurrentUser] = useState("You");

  return (
    <Router>
      <div className="app">
        <Navigation currentUser={currentUser} />

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
