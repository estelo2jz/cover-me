import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.scss";
import CoverMe from "../../assets/covermee_no_bg.png";

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

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className={`nav ${hidden ? "nav--hidden" : ""}`}>
      <div className="nav__wrapper">
        <div className="nav__left">
          <Link to="/">
            <img src={CoverMe} alt="Logo" className="nav__logo" />
          </Link>
        </div>

        <nav className={`nav__menu ${isOpen ? "open" : ""}`}>
          <Link to="/dashboard" onClick={close} className={isActive("/dashboard") ? "active" : ""}>
            Groups
          </Link>
          <Link to="/users" onClick={close} className={isActive("/users") ? "active" : ""}>
            Users
          </Link>
        </nav>

        <Link to={`/profile/${currentUser}`} className="nav__user">
          {currentUser}
        </Link>
      </div>
    </header>
  );
};

export default Navigation;
