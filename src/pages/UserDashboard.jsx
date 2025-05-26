// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import "./UserDashboard.scss";

const UserDashboard = ({ currentUser }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("savingsGroups");
    if (stored) {
      const allGroups = JSON.parse(stored);
      const joinedGroups = allGroups.filter(g =>
        Array.isArray(g.members) && g.members.some(m => m.name === currentUser)
      );
      setGroups(joinedGroups);
    }
  }, [currentUser]);

  const handleMarkPayment = (groupId, monthIndex) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        if (!group.deposits[currentUser]) {
          group.deposits[currentUser] = Array(group.months).fill(false);
        }
        group.deposits[currentUser][monthIndex] = true;
      }
      return group;
    });

    setGroups(updatedGroups);

    const allStored = JSON.parse(localStorage.getItem("savingsGroups"));
    const updatedAll = allStored.map(g => {
      const match = updatedGroups.find(ug => ug.id === g.id);
      return match ? match : g;
    });

    localStorage.setItem("savingsGroups", JSON.stringify(updatedAll));
  };

  return (
    <div className="user-dashboard">
      <h2>📋 My Groups</h2>
      <p><strong>User:</strong> {currentUser}</p>

      {groups.length === 0 ? (
        <p>You haven’t joined any groups yet.</p>
      ) : (
        <div className="user-dashboard__grid">
          {groups.map(group => (
            <div key={group.id} className="user-dashboard__card">
              <h3>{group.name}</h3>
              <p><strong>Target:</strong> ${group.target}</p>
              <p><strong>Duration:</strong> {group.months} months</p>
              <p><strong>Monthly Payment:</strong> ${group.monthlyPerUser?.toFixed(2)}</p>

              <h4>Your Payment Progress</h4>
              <ul className="user-dashboard__payments">
                {group.deposits[currentUser]?.map((paid, index) => (
                  <li key={index}>
                    <span>Month {index + 1}: {paid ? "✅ Paid" : "❌ Not Paid"}</span>
                    {paid ? (
                      <span className="complete-label">✅ Complete</span>
                    ) : (
                      <button
                        className="pay-btn"
                        onClick={() => handleMarkPayment(group.id, index)}
                      >
                        Mark as Paid
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
