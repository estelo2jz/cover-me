// src/components/GroupDetail/GroupDetail.jsx
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./GroupDetail.scss";
import Modal from "../Modal/Modal";

const GroupDetail = ({ group, currentUser, onBack, onUpdate, onDelete }) => {
  const [commentText, setCommentText] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="group-detail">
      <button className="group-detail__back" onClick={onBack}>← Back</button>
      <h2>{group.name}</h2>
      <p>Target: ${group.target.toFixed(2)}</p>
      <p>Duration: {group.months} months</p>
      <p>Member Limit: {group.memberLimit ?? "6"}</p>
      <p>Monthly per user: <strong>${group.monthlyPerUser.toFixed(2)}</strong></p>

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

      <h3>Comments</h3>
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

      {group.creator === currentUser && (
        <>
          <button
            className="group-detail__delete"
            onClick={() => setShowModal(true)}
          >
            🗑 Delete Group
          </button>

          <Modal
            isOpen={showModal}
            title="Delete Group"
            message={`Are you sure you want to delete "${group.name}"? This cannot be undone.`}
            onConfirm={() => {
              onDelete(group.id);
              setShowModal(false);
            }}
            onCancel={() => setShowModal(false)}
          />
        </>
      )}
    </div>
  );
};

export default GroupDetail;
