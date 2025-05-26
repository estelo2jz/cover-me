// src/components/GroupDetail/GroupDetail.jsx
import React, { useState } from "react";
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

const GroupDetail = ({ group, currentUser, onBack, onUpdate, onDelete }) => {
  const [commentText, setCommentText] = useState("");

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
      time: new Date().toLocaleString()
    };
    const updated = { ...group };
    updated.comments.push(newComment);
    onUpdate(updated);
    setCommentText("");
  };

  const chartData = group.members.map((member) => {
    const name = member.name;
    const paidMonths = group.deposits?.[name]?.filter(Boolean).length || 0;
    const contributed = paidMonths * group.monthlyPerUser;
    return {
      name,
      contributed: parseFloat(contributed.toFixed(2))
    };
  });

  return (
    <div className="group-detail">
      <div className="group-detail__header">
        <button className="group-detail__back" onClick={onBack}>← Back</button>
        <div>
          <h2>{group.name}</h2>
          <p className={`group-detail__status ${group.isActive ? "active" : "pending"}`}>
            {group.isActive ? "🟢 Active" : "🕓 Pending"}
          </p>
        </div>
      </div>

      <div className="group-detail__grid">
        <div className="group-detail__info">
          <h3>Group Info</h3>
          <p><strong>Target:</strong> ${group.target.toFixed(2)}</p>
          <p><strong>Duration:</strong> {group.months} months</p>
          <p><strong>Monthly/User:</strong> ${group.monthlyPerUser.toFixed(2)}</p>
          <p><strong>Member Limit:</strong> {group.memberLimit}</p>
        </div>

        <div className="group-detail__chart-box">
          <h3>Contribution Chart</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="contributed" fill="#5b3cc4" name="Contributed ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3>Your Monthly Progress</h3>
      <ul className="group-detail__deposits">
        {group.deposits[currentUser]?.map((paid, idx) => (
          <li key={idx}>
            Month {idx + 1}:{" "}
            {paid ? (
              <span className="paid-label">✅ Complete</span>
            ) : group.isActive ? (
              <button
                onClick={() => handleDeposit(idx)}
                className="pay-btn"
              >
                Mark as Paid
              </button>
            ) : (
              <span className="disabled-label">Pending Start</span>
            )}
          </li>
        ))}
      </ul>


      <div className="group-detail__section">
        <h3>Comments</h3>
        <div className="group-detail__comments">
          {group.comments.map((c, idx) => (
            <div key={idx} className="group-detail__comment">
              <strong>{c.user}</strong> ({c.time}): {c.text}
            </div>
          ))}
        </div>

        <form
          className="group-detail__form"
          onSubmit={(e) => {
            e.preventDefault();
            handleComment();
          }}
        >
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
  );
};

export default GroupDetail;
