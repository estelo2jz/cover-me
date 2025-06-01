import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSwitch from "../../components/UserSwitch/UserSwitch";
import "./User.scss";

export default function User({ currentUser, setCurrentUser }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("storedUsers");
    return saved ? JSON.parse(saved).filter((u) => u.name !== "You") : [];
  });

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [newTheme, setNewTheme] = useState("light");
  const [animatedUsers, setAnimatedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser && users.length > 0) {
      setCurrentUser(users[0].name);
    }
  }, [users, currentUser, setCurrentUser]);

  useEffect(() => {
    localStorage.setItem("storedUsers", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    let i = 0;
    setAnimatedUsers([]);
    const interval = setInterval(() => {
      setAnimatedUsers((prev) => {
        if (i < users.length) {
          const updated = [...prev, users[i]];
          i++;
          return updated;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 80);
    return () => clearInterval(interval);
  }, [users]);

  const handleAddNewUser = () => {
    const trimmed = newUserName.trim();
    if (!trimmed || users.some(u => u.name === trimmed)) return;

    const newUser = {
      name: trimmed,
      avatar: newAvatar,
      theme: newTheme
    };

    const updatedList = [...users, newUser];
    setUsers(updatedList);
    setCurrentUser(trimmed);

    setNewUserName("");
    setNewAvatar(null);
    setNewTheme("light");
    setShowAddUserModal(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const getUserStats = (user) => {
    const stored = JSON.parse(localStorage.getItem("savingsGroups")) || [];
    const userGroups = stored.filter((g) => g.members?.some((m) => m.name === user));
    const totalTarget = userGroups.reduce((sum, g) => sum + g.target, 0);
    const completed = userGroups.filter(
      (g) => Array.isArray(g.deposits?.[user]) && g.deposits[user].every(Boolean)
    ).length;

    return {
      groupCount: userGroups.length,
      totalTarget: totalTarget.toFixed(2),
      completed,
    };
  };

  const handleUserClick = (userName) => {
    navigate(`/profile/${userName}`);
    setCurrentUser(userName);
    setSelectedUser(userName);
  };

  return (
    <>
      <div className="dashboard__add-user-bar">
        <button className="dashboard__add-user-btn" onClick={() => setShowAddUserModal(true)}>
          ➕ Add New User
        </button>
      </div>

      <UserSwitch
        users={animatedUsers}
        currentUser={currentUser}
        selectedUser={selectedUser}
        setCurrentUser={setCurrentUser}
        getUserStats={getUserStats}
        onUserClick={handleUserClick}
      />

      {showAddUserModal && (
        <div className="dashboard__modal-overlay">
          <div className="dashboard__modal user-modal">
            <h3>Create New User</h3>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter name"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
            {newAvatar && (
              <img src={newAvatar} alt="Preview" className="user-modal__avatar-preview" />
            )}
            <select value={newTheme} onChange={(e) => setNewTheme(e.target.value)}>
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
              <option value="blue">Blue Theme</option>
            </select>
            <button onClick={handleAddNewUser}>Add</button>
            <button className="cancel" onClick={() => setShowAddUserModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
