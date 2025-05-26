// src/App.jsx
import React, { useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Dashboard from "./pages/Dashboard/Dashboard";
import UserProfile from "./pages/UserProfile";
import Admin from "./pages/Admin";
import CreateGroupPage from "./pages/CreateGroupPage";
import GroupDetailWrapper from "./components/GroupDetail/GroupDetailWrapper";
import Navigation from "./components/Navigation/Navigation";

import "./App.scss";
import "./animations/routeAnimations.scss";

const AppRoutes = ({ currentUser, setCurrentUser }) => {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.pathname}
        nodeRef={nodeRef}
        classNames="fade"
        timeout={300}
        unmountOnExit
      >
        <div ref={nodeRef}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                <Dashboard
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
            <Route path="/profile/:user" element={<UserProfile />} />
            <Route
              path="/group/:id"
              element={<GroupDetailWrapper currentUser={currentUser} />}
            />
            <Route
              path="/create"
              element={<CreateGroupPage currentUser={currentUser} />}
            />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState("You");

  return (
    <Router>
      <div className="app">
        <Navigation currentUser={currentUser} />
        <main className="app__main">
          <AppRoutes
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </main>
      </div>
    </Router>
  );
};

export default App;
