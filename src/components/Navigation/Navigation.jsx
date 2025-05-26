// src/components/Navigation/Navigation.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.scss";

const Navigation = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <header className="nav">
      <div className="nav__wrapper">
        <div className="nav__logo">💰 Cover Me</div>

        <nav className={`nav__menu ${isOpen ? "open" : ""}`}>
          <Link to="/" onClick={close} className={location.pathname === "/" ? "active" : ""}>Home</Link>
          <Link to="/my-groups" onClick={close} className={location.pathname === "/my-groups" ? "active" : ""}>My Groups</Link>
          <Link to="/create" onClick={close} className={location.pathname === "/create" ? "active" : ""}>Create</Link>
          {/* <Link to="/admin" onClick={close} className={location.pathname === "/admin" ? "active" : ""}>Admin</Link> */}
        </nav>

        <div className="nav__user">{currentUser}</div>

        <div className={`nav__hamburger ${isOpen ? "open" : ""}`} onClick={toggle}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
