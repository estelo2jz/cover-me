// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.scss";

const UserDashboard = ({ currentUser }) => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("savingsGroups");
    if (stored) {
      const parsed = JSON.parse(stored);
      const userGroups = parsed.filter(g =>
        g.members?.some(m => m.name === currentUser)
      );
      setGroups(userGroups);
    }
  }, [currentUser]);

  return (
    <div className="user-dashboard">
      <h2>📁 Your Savings Groups</h2>

      {groups.length === 0 ? (
        <p className="user-dashboard__empty">You're not in any groups yet.</p>
      ) : (
        <div className="user-dashboard__grid">
          {groups.map(group => (
            <div key={group.id} className="user-dashboard__card">
              <div className="user-dashboard__header">
                <h3>{group.name}</h3>
                <span className={group.isActive ? "active" : "pending"}>
                  {group.isActive ? "🟢 Active" : "🕓 Pending"}
                </span>
              </div>
              <p><strong>Target:</strong> ${group.target.toFixed(2)}</p>
              <p><strong>Duration:</strong> {group.months} months</p>
              <p><strong>Monthly:</strong> ${group.monthlyPerUser.toFixed(2)}</p>
              <p><strong>Members:</strong> {group.members.length}/{group.memberLimit}</p>

              <button onClick={() => navigate(`/group/${group.id}`)}>
                View Group
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
