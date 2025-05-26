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
      <p className="app__description">
      CoverMe is a collaborative savings platform that connects users to pool their funds and grow their savings collectively. Whether it's short-term goals or long-term financial planning,
      SaveTogether allows members to choose contract lengths that fit their needs. By committing to a shared savings plan, users can benefit from increased financial security, smart goal-setting, and even potential rewards for staying committed. Team up, save smarter, and reach financial goals faster—together!
      </p>

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
