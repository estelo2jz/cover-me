// src/App.jsx
import React, { useState, useRef, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Dashboard from "./pages/Dashboard/Dashboard";
import UserProfile from "./pages/UserProfile";
import Admin from "./pages/Admin";
import CreateGroupPage from "./pages/CreateGroupPage";
import GroupDetailWrapper from "./components/GroupDetail/GroupDetailWrapper";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./pages/Footer/Footer";
import Login from "./components/Login/Login";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Home from "./pages/Home/Home";
import User from "./pages/User/User";

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
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                currentUser ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login
                    onLogin={(user) => {
                      setCurrentUser(user);
                      localStorage.setItem("currentUser", user);
                    }}
                  />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                currentUser ? (
                  <Dashboard
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/users"
              element={
                currentUser ? (
                  <User
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile/:user"
              element={
                currentUser ? <UserProfile /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/group/:id"
              element={
                currentUser ? (
                  <GroupDetailWrapper currentUser={currentUser} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/create"
              element={
                currentUser ? (
                  <CreateGroupPage currentUser={currentUser} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin"
              element={
                currentUser ? <Admin /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("currentUser") || "";
  });

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        {currentUser && (
          <Navigation
            currentUser={currentUser}
            setCurrentUser={setCurrentUser} // <-- this enables logout
          />
        )}
        <main className="app__main">
          <AppRoutes
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </main>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
