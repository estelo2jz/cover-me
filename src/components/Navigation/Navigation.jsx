import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navigation.scss";
import CoverMe from "../../assets/covermee_no_bg.png";

const Navigation = ({ currentUser, setCurrentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    close();
    navigate("/login");
  };

  return (
    <header className={`nav ${hidden ? "nav--hidden" : ""}`}>
      <div className="nav__wrapper">
        <div className="nav__left">
          <Link to="/">
            <img src={CoverMe} alt="Logo" className="nav__logo" />
          </Link>
        </div>

        <nav className={`nav__menu ${isOpen ? "open" : ""}`}>
          <Link
            to="/dashboard"
            onClick={close}
            className={isActive("/dashboard") ? "active" : ""}
          >
            Groups
          </Link>
          <Link
            to="/users"
            onClick={close}
            className={isActive("/users") ? "active" : ""}
          >
            Users
          </Link>
        </nav>

        <div className="nav__right">
          <Link to={`/profile/${currentUser}`} className="nav__user">
            {currentUser}
          </Link>
          <button className="nav__logout" onClick={handleLogout}>
            Logout
          </button>
          <button className="nav__toggle" onClick={toggle}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
