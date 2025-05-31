import React from "react";
import "./Groups.scss";

const Groups = ({ groups, currentUser, onJoin, onPreview }) => {
  return (
    <div className="groups">
      {groups.map((group) => {
        const isMember = group.members?.some((m) => m.name === currentUser);
        const isFull = group.members?.length >= group.memberLimit;

        return (
          <div key={group.id} className="group-card">
            <div className="group-card__main">
              <div
                className="group-card__clickable"
                onClick={() => typeof onPreview === "function" && onPreview(group)}
              >
                <h3>{group.name}</h3>
                <p>Status: {group.isActive ? "🟢 Active" : "🕓 Pending"}</p>
                <p>Target: ${group.target}</p>
                <p>Members: {group.members.length} / {group.memberLimit}</p>
                <p>Duration: {group.months} months</p>
              </div>

              <div className="group-card__members">
                <h4>Members</h4>
                <ul>
                  {group.members.map((member, index) => (
                    <li key={index}>{member.name}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="group-card__actions">
              {!isMember && !isFull && (
                <button
                  className="join-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJoin(group);
                  }}
                >
                  Join Group
                </button>
              )}
              {isMember && <p className="member-msg">✅ You’re a member</p>}
              {isFull && !isMember && (
                <p className="full-msg">⚠️ Group is full</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Groups;
