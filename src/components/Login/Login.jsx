// src/pages/Login/Login.jsx
import React, { useState } from "react";
import "./Login.scss";
import Logo from "../../assets/covermee_no_bg.png"; // Adjust path as needed

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onLogin(trimmed);
      localStorage.setItem("currentUser", trimmed);

      const existingUsers =
        JSON.parse(localStorage.getItem("storedUsers")) || [];
      if (!existingUsers.includes(trimmed)) {
        localStorage.setItem(
          "storedUsers",
          JSON.stringify([...existingUsers, trimmed])
        );
      }
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleLogin}>
        <img src={Logo} alt="CoverMee Logo" className="login__logo" />
        <h2>Welcome To CoverMee!</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
};

export default Login;
