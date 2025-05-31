// src/components/UserSwitch/UserSwitch.jsx
import React from "react";
import "./UserSwitch.scss";
import { useNavigate } from "react-router-dom";

const UserSwitch = ({ users, currentUser, setCurrentUser, getUserStats }) => {
  const navigate = useNavigate();

  const handleProfileView = (user, e) => {
    e.stopPropagation(); // prevent parent card click
    setCurrentUser(user);
    navigate(`/profile/${user}`);
  };

  return (
    <div className="user-switch">
      <p><strong>Simulate User:</strong></p>
      <div className="user-switch__grid">
        {users.map((user) => {
          const isActive = user === currentUser;
          const { groupCount, totalTarget, completed } = getUserStats(user);

          return (
            <div
              key={user}
              className={`dashboard__user-card ${isActive ? "active" : ""}`}
              onClick={() => setCurrentUser(user)}
            >
              <div className="user-switch__info">
                <p className="user-switch__name"><strong>{user}</strong></p>
                <p>{groupCount} groups</p>
                <p>💰 ${totalTarget}</p>
                <p>✅ {completed} completed</p>
              </div>

              <button
                className="user-switch__view-btn"
                onClick={(e) => handleProfileView(user, e)}
              >
                View Profile
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserSwitch;
