import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.scss";
import Logo from "../../assets/covermee_no_bg.png";

const CreateAccount = ({ onAccountCreated }) => {
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [theme, setTheme] = useState("light");
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (created) {
      navigate("/dashboard");
    }
  }, [created, navigate]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed || passcode.length !== 3) {
      setError("Name and 3-character passcode are required.");
      return;
    }

    const newUser = {
      name: trimmed,
      passcode,
      avatar,
      theme,
    };

    const stored = JSON.parse(localStorage.getItem("storedUsers")) || [];
    const exists = stored.some((u) => u.name === newUser.name);

    if (exists) {
      setError("A user with this name already exists.");
      return;
    }

    localStorage.setItem("storedUsers", JSON.stringify([...stored, newUser]));
    localStorage.setItem("currentUser", newUser.name);
    onAccountCreated(newUser.name);

    // ✅ Trigger navigation via useEffect
    setCreated(true);
  };

  return (
    <div className="create">
      <form className="create__form" onSubmit={handleCreate}>
        <img src={Logo} alt="Logo" className="create__logo" />
        <h2>Create Account</h2>

        {error && <p className="create__error">{error}</p>}

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="3-char passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value.slice(0, 3))}
          required
        />

        <input type="file" accept="image/*" onChange={handleAvatarUpload} />
        {avatar && (
          <img src={avatar} className="create__avatar-preview" alt="avatar" />
        )}

        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
          <option value="blue">Blue Theme</option>
        </select>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccount;
