// src/components/Groups/Groups.jsx
import React from "react";
import "./Groups.scss";

const Groups = ({ groups, onJoin, onPreview, currentUser }) => {
  return (
    <div className="groups">
      {groups.map((group) => {
        const isMember = Array.isArray(group.members) && group.members.some((m) => m.name === currentUser);
        {/* const isFull = group.members?.length >= group.memberLimit; */}

        return (
          <div
            key={group.id}
            className="groups__card"
            onClick={() => onPreview(group)}
          >
            <h3>{group.name}</h3>
            <p>Status: {group.isActive ? "🟢 Active" : "🕓 Pending"}</p>
            <p>Members: {group.members.length} / 6</p>

            <p>Target: ${group.target.toFixed(2)}</p>
            <p>Duration: {group.months} months</p>

            {group.isActive && isMember && (
              <p>You must deposit: <strong>${group.monthlyPerUser.toFixed(2)}</strong></p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Groups;
