// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import Logo from "../../assets/covermee_no_bg.png";

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [welcomeBack, setWelcomeBack] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed || !passcode) {
      setError("Both name and passcode are required.");
      return;
    }

    if (passcode.length !== 3) {
      setError("Passcode must be exactly 3 characters.");
      return;
    }

    try {
      const storedUsers = JSON.parse(localStorage.getItem("storedUsers")) || [];
      const user = storedUsers.find(u => u.name === trimmed);

      if (!user) {
        setError("User not found.");
        return;
      }

      if (user.passcode !== passcode) {
        setError("Incorrect passcode.");
        return;
      }

      setError("");
      setWelcomeBack(true);
      localStorage.setItem("currentUser", trimmed);

      queueMicrotask(() => {
        onLogin(trimmed);
      });

    } catch (err) {
      console.error("Login failed:", err);
      setError("Unexpected error during login.");
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleLogin}>
        <img src={Logo} alt="CoverMee Logo" className="login__logo" />
        <h2>
          {welcomeBack ? `Welcome back, ${name.trim()}!` : "Welcome To CoverMee!"}
        </h2>

        {error && <p className="login__error">{error}</p>}

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setWelcomeBack(false);
            setError("");
          }}
        />
        <input
          type="password"
          maxLength={3}
          placeholder="3-digit passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
        <button type="submit">Enter</button>

        <p className="login__footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/create-account")}>Create one</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
