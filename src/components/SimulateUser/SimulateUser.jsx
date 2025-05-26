// src/components/SimulateUser/SimulateUser.jsx
import React, { useState } from "react";
import "./SimulateUser.scss";

const SimulateUser = ({ users, currentUser, setCurrentUser, getUserStats, updateUserProfile }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!selectedUser) return;
    updateUserProfile(selectedUser, {
      name: editName,
      avatar: editAvatar,
    });
    setSelectedUser(null);
  };

  return (
    <div className="simulate-user">
      <p><strong>Simulate User:</strong></p>
      <div className="simulate-user__grid">
        {users.map((user) => {
          const isActive = user.name === currentUser;
          const { groupCount, totalTarget, completed } = getUserStats(user.name);

          return (
            <div
              key={user.name}
              className={`simulate-user__card ${isActive ? "active" : ""}`}
              onClick={() => setCurrentUser(user.name)}
              onDoubleClick={() => {
                setSelectedUser(user.name);
                setEditName(user.name);
                setEditAvatar(user.avatar || null);
              }}
            >
              <div className="simulate-user__avatar-container">
                <div className="simulate-user__avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>

                <div className="simulate-user__tooltip">
                  <p><strong>{user.name}</strong></p>
                  <p>Groups: {groupCount}</p>
                  <p>💰 Total: ${totalTarget}</p>
                  <p>✅ Completed: {completed}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedUser && (
        <div className="simulate-user__modal" onClick={(e) => {
          if (e.target.classList.contains("simulate-user__modal")) setSelectedUser(null);
        }}>
          <div className="simulate-user__modal-content">
            <button className="simulate-user__modal-close" onClick={() => setSelectedUser(null)}>❌</button>
            <h3>Edit Profile</h3>
            <div className="simulate-user__modal-body">
              <div className="simulate-user__modal-avatar-preview">
                {editAvatar ? <img src={editAvatar} alt="preview" /> : <div className="simulate-user__avatar-fallback">{editName.charAt(0)}</div>}
              </div>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter name"
              />
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
              <button onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulateUser;
