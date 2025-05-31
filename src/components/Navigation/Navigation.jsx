// src/components/Navigation/Navigation.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.scss";
import CoverMe from "../../assets/covermee.png"

const Navigation = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY && currentY > 50);
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`nav ${hidden ? "nav--hidden" : ""}`}>
      <div className="nav__wrapper">
        <div className="nav__left">
          <Link to="/">
            <img src={CoverMe} alt="Logo" className="nav__logo" />
          </Link>
          {/* <button
            className={`nav__hamburger ${isOpen ? "open" : ""}`}
            onClick={toggle}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button> */}
        </div>

        <nav className={`nav__menu ${isOpen ? "open" : ""}`}>
          <Link to="/dashboard" onClick={close}>Groups</Link>
          <Link to="/users" onClick={close}>Users</Link>
          {/* <Link to="/admin" onClick={close}>Admin</Link> */}
        </nav>

        <div className="nav__user">{currentUser}</div>
      </div>
    </header>
  );
};

export default Navigation;
