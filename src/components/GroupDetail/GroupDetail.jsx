// src/components/GroupDetail/GroupDetail.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "./GroupDetail.scss";

const GroupDetail = ({ group, currentUser, onBack, onUpdate }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [expandedMember, setExpandedMember] = useState(null);

  const handleDeposit = (monthIndex) => {
    const updated = { ...group };
    updated.deposits[currentUser][monthIndex] = true;
    onUpdate(updated);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      user: currentUser,
      text: commentText,
      time: new Date().toLocaleString(),
    };
    const updated = { ...group };
    updated.comments.push(newComment);
    onUpdate(updated);
    setCommentText("");
    setShowComments(false);
  };

  const chartData = group.members.map((member) => {
    const name = member.name;
    const paidMonths = group.deposits?.[name]?.filter(Boolean).length || 0;
    const contributed = paidMonths * group.monthlyPerUser;
    return {
      name,
      contributed: parseFloat(contributed.toFixed(2)),
    };
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowComments(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="group-detail">
      <button className="group-detail__back" onClick={onBack}>← Back</button>
      <h2>{group.name}</h2>
      <p><strong>Target:</strong> ${group.target.toFixed(2)}</p>
      <p><strong>Duration:</strong> {group.months} months</p>
      <p><strong>Monthly per user:</strong> ${group.monthlyPerUser.toFixed(2)}</p>
      <p><strong>Created by:</strong> {group.creator || "Unknown"}</p>

      <h3>Contribution Chart</h3>
      <div className="group-detail__chart">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="contributed" fill="#5b3cc4" name="Contributed ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Your Monthly Progress</h3>
      <ul className="group-detail__deposits">
        {group.deposits[currentUser]?.map((paid, idx) => (
          <li key={idx}>
            Month {idx + 1}: {paid ? "✅ Paid" : "❌ Not Paid"}
            {!paid && (
              <button onClick={() => handleDeposit(idx)} className="pay-btn">Mark as Paid</button>
            )}
          </li>
        ))}
      </ul>

      <h3>Members & Progress</h3>
      <ul className="group-detail__members">
        {group.members.map((member) => {
          const deposits = group.deposits?.[member.name] || [];
          const paid = deposits.filter(Boolean).length;
          const percent = Math.round((paid / group.months) * 100);

          return (
            <li key={member.name}>
              <div className="member-info" onClick={() => setExpandedMember(expandedMember === member.name ? null : member.name)}>
                <span className="member-avatar">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} />
                  ) : (
                    member.name.charAt(0)
                  )}
                </span>
                <span className="member-name">{member.name}</span>
                {member.name === group.creator && <span className="creator-tag">(Creator)</span>}
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
              </div>
              <span className="progress-label">{percent}%</span>

              {expandedMember === member.name && (
                <ul className="member-history">
                  {deposits.map((d, i) => (
                    <li key={i}>Month {i + 1}: {d ? "✅ Paid" : "❌ Not Paid"}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <h3>Comments</h3>
      <button className="group-detail__toggle-comments" onClick={() => setShowComments(!showComments)}>
        {showComments ? "Close Comments" : "Open Comments"}
      </button>

      {showComments && (
        <div
          className="group-detail__modal"
          onClick={(e) => {
            if (e.target.classList.contains("group-detail__modal")) {
              setShowComments(false);
            }
          }}
        >
          <div className="group-detail__modal-content">
            <button
              className="group-detail__modal-close"
              onClick={() => setShowComments(false)}
            >
              ❌
            </button>

            <div className="group-detail__comments">
              {group.comments.map((c, idx) => (
                <div key={idx} className="group-detail__comment">
                  <strong>{c.user}</strong> ({c.time}): {c.text}
                </div>
              ))}
            </div>

            <form className="group-detail__form" onSubmit={(e) => { e.preventDefault(); handleComment(); }}>
              <input
                type="text"
                placeholder="Add comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit">Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
