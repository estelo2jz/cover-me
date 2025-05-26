// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import "./Admin.scss";

const Admin = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("savingsGroups");
    if (stored) {
      setGroups(JSON.parse(stored));
    }
  }, []);

  const deleteGroup = (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      const updated = groups.filter((g) => g.id !== groupId);
      setGroups(updated);
      localStorage.setItem("savingsGroups", JSON.stringify(updated));
    }
  };

  return (
    <div className="admin">
      <h1>🔐 Admin Panel</h1>
      <p>Total Groups: {groups.length}</p>

      <div className="admin__grid">
        {groups.map((group) => (
          <div key={group.id} className="admin__card">
            <h3>{group.name}</h3>
            <p><strong>Target:</strong> ${group.target}</p>
            <p><strong>Duration:</strong> {group.months} months</p>
            <p><strong>Members:</strong> {group.members?.length} / {group.memberLimit}</p>
            <p><strong>Status:</strong> {group.isActive ? "🟢 Active" : "🕓 Pending"}</p>
            <p><strong>Created By:</strong> {group.creator}</p>
            <button onClick={() => deleteGroup(group.id)} className="admin__delete-btn">
              🗑 Delete Group
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
