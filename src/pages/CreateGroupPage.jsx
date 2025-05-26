// src/pages/CreateGroupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateGroupPage.scss";

const CreateGroupPage = ({ currentUser }) => {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [months, setMonths] = useState("6");
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name || !target || !months) return;

    const newGroup = {
      id: Date.now(),
      name,
      target: parseFloat(target),
      months: parseInt(months),
      memberLimit: 6,
      members: [{ id: currentUser.toLowerCase(), name: currentUser }],
      deposits: {
        [currentUser]: Array(parseInt(months)).fill(false),
      },
      comments: [],
      isActive: false,
      monthlyPerUser: 0,
      creator: currentUser,
    };

    const stored = JSON.parse(localStorage.getItem("savingsGroups") || "[]");
    stored.unshift(newGroup);
    localStorage.setItem("savingsGroups", JSON.stringify(stored));

    // Redirect to Dashboard or My Groups
    navigate("/");
  };

  return (
    <div className="create-group-page">
      <h2>📦 Create a New Savings Group</h2>
      <form onSubmit={handleCreate} className="create-group-form">
        <label>
          Group Name:
          <input
            type="text"
            placeholder="e.g. Wedding Fund"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Target Amount ($):
          <input
            type="number"
            placeholder="e.g. 3000"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
          />
        </label>

        <label>
          Duration (months):
          <select value={months} onChange={(e) => setMonths(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} month(s)
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default CreateGroupPage;
