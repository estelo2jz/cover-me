// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UserProfile.scss";

const UserProfile = () => {
  const { user } = useParams();
  const navigate = useNavigate();
  const [userGroups, setUserGroups] = useState([]);
  const [createdGroups, setCreatedGroups] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savingsGroups")) || [];

    const joined = stored.filter((g) =>
      g.members?.some((m) => m.name === user)
    );
    const created = stored.filter((g) => g.creator === user);

    setUserGroups(joined);
    setCreatedGroups(created);
  }, [user]);

  const totalTarget = userGroups.reduce((sum, g) => sum + g.target, 0);
  const completed = userGroups.filter(
    (g) => Array.isArray(g.deposits?.[user]) && g.deposits[user].every(Boolean)
  ).length;

  return (
    <div className="user-profile">
      <button className="user-profile__back" onClick={() => navigate(-1)}>← Back</button>

      <div className="user-profile__header">
        <div className="user-profile__avatar">{user.charAt(0)}</div>
        <div>
          <h2>{user}</h2>
          <p>Groups Joined: {userGroups.length}</p>
          <p>Groups Created: {createdGroups.length}</p>
          <p>Total Target: ${totalTarget.toFixed(2)}</p>
          <p>Completed Groups: {completed}</p>
        </div>
      </div>

      <h3>Your Groups</h3>
      <div className="user-profile__groups">
        {userGroups.length === 0 ? (
          <p>No groups joined yet.</p>
        ) : (
          userGroups.map((group) => {
            const paid = group.deposits?.[user]?.filter(Boolean).length || 0;
            const progress = Math.round((paid / group.months) * 100);
            const isCreator = group.creator === user;

            return (
              <div
                key={group.id}
                className="user-profile__group-card"
                onClick={() => navigate(`/group/${group.id}`)}
              >
                <h4>{group.name}</h4>
                {isCreator && <span className="creator-label">Created by you</span>}
                <p>Status: {group.isActive ? "🟢 Active" : "🕓 Pending"}</p>
                <p>Target: ${group.target}</p>
                <p>Months: {group.months}</p>
                <p>Progress: {paid}/{group.months} months ({progress}%)</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserProfile;
