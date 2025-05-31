// src/pages/User/User.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSwitch from "../../components/UserSwitch/UserSwitch";
import "./User.scss";

export default function User({ currentUser, setCurrentUser }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("storedUsers");
    return saved ? JSON.parse(saved) : [
      "You", "Alice", "Bob", "Charlie", "Diana", "Ethan", "Frank", "Grace",
      "Hannah", "Ivan", "Jenny", "Kyle", "Liam", "Mia", "Noah", "Olivia", "Paul",
      "Quinn", "Riley", "Sophia", "Tyler", "Uma", "Victor", "Telo", "Xavier",
      "Yara", "Zane"
    ];
  });

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser && users.length > 0) {
      setCurrentUser(users[0]);
    }
  }, [users, currentUser, setCurrentUser]);

  useEffect(() => {
    localStorage.setItem("storedUsers", JSON.stringify(users));
  }, [users]);

  const handleAddNewUser = () => {
    const trimmed = newUserName.trim();
    if (!trimmed) return;

    const newList = users.includes(trimmed) ? users : [...users, trimmed];
    setUsers(newList);
    localStorage.setItem("storedUsers", JSON.stringify(newList));

    if (!currentUser) {
      setCurrentUser(trimmed);
    }

    setNewUserName("");
    setShowAddUserModal(false);
  };

  const getUserStats = (user) => {
    const stored = JSON.parse(localStorage.getItem("savingsGroups")) || [];
    const userGroups = stored.filter(g => g.members?.some(m => m.name === user));
    const totalTarget = userGroups.reduce((sum, g) => sum + g.target, 0);
    const completed = userGroups.filter(g =>
      Array.isArray(g.deposits?.[user]) && g.deposits[user].every(Boolean)
    ).length;

    return {
      groupCount: userGroups.length,
      totalTarget: totalTarget.toFixed(2),
      completed
    };
  };

  // 🆕 Handle navigation to profile
  const handleUserClick = (userName) => {
    navigate(`/profile/${userName}`);
  };

  return (
    <>
      <div className="dashboard__add-user-bar">
        <button className="dashboard__add-user-btn" onClick={() => setShowAddUserModal(true)}>
          ➕ Add New User
        </button>
      </div>

      <UserSwitch
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        getUserStats={getUserStats}
        onUserClick={handleUserClick} // 🆕 Pass click handler
      />

      {showAddUserModal && (
        <div className="dashboard__modal-overlay">
          <div className="dashboard__modal">
            <h3>New User</h3>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter user name"
            />
            <button onClick={handleAddNewUser}>Add</button>
            <button className="cancel" onClick={() => setShowAddUserModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
