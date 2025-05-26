// src/components/Groups/GroupPreview.jsx
import React, { useState } from "react";
import "./GroupPreview.scss";

const GroupPreview = ({ group, currentUser, onBack, onJoin, onDelete }) => {
  const [showAdminOptions, setShowAdminOptions] = useState(false);
  const isMember = Array.isArray(group.members) && group.members.some((m) => m.name === currentUser);
  const isFull = group.members?.length >= group.memberLimit;

  return (
    <div className="group-preview">
      <div className="group-preview__header">
        <button onClick={onBack} className="group-preview__back">← Back</button>
        <h2>{group.name}</h2>
        <p className="group-preview__status">
          {group.isActive ? "🟢 Active" : "🕓 Pending"}
        </p>
      </div>

      <div className="group-preview__grid">
        <div className="group-preview__info">
          <h3>Group Details</h3>
          <p><strong>Target:</strong> ${group.target}</p>
          <p><strong>Duration:</strong> {group.months} months</p>
          <p><strong>Member Limit:</strong> {group.memberLimit ?? "6"}</p>
          <p><strong>Current Members:</strong> {group.members.length}</p>
          <p><strong>Created By:</strong> {group.creator ?? "Unknown"}</p>
        </div>

        <div className="group-preview__members">
          <h3>Members</h3>
          {group.members.length > 0 ? (
            <ul>
              {group.members.map((m, i) => (
                <li key={i}>{m.name}</li>
              ))}
            </ul>
          ) : (
            <p>No members yet.</p>
          )}
        </div>
      </div>

      {!isMember && !isFull && (
        <button className="group-preview__join" onClick={() => onJoin(group)}>
          Join this Group
        </button>
      )}

      {isMember && (
        <p className="group-preview__message">✅ You’re already a member of this group.</p>
      )}

      {isFull && !isMember && (
        <p className="group-preview__message">⚠️ Group is full.</p>
      )}

      {group.creator === currentUser && (
        <>
          <button
            className="group-preview__manage-btn"
            onClick={() => setShowAdminOptions(!showAdminOptions)}
          >
            ⚙ Manage Group
          </button>

          {showAdminOptions && (
            <div className="group-preview__admin-panel">
              <p><strong>Admin Options:</strong></p>
              <button
                className="group-preview__delete-btn"
                onClick={() => {
                  if (window.confirm(`Delete "${group.name}"?`)) {
                    onDelete(group.id);
                  }
                }}
              >
                🗑 Delete Group
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GroupPreview;
