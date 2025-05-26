// src/components/CreateGroup/CreateGroup.jsx
import React, { useState } from "react";
import "./CreateGroup.scss";

const CreateGroup = ({ onCreate, currentUser }) => {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [months, setMonths] = useState("6");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !target || !months) return;

    const group = {
      id: Date.now(),
      name,
      target: parseFloat(target),
      months: parseInt(months),
      memberLimit: 6,
      members: [{ id: currentUser.toLowerCase(), name: currentUser }],
      deposits: {
        [currentUser]: Array(parseInt(months)).fill(false)
      },
      comments: [],
      isActive: false,
      monthlyPerUser: 0,
      creator: currentUser
    };

    onCreate(group); // ✅ This calls handleCreateGroup passed from Dashboard
    setName("");
    setTarget("");
    setMonths("6");
  };

  return (
    <form className="create-group" onSubmit={handleSubmit}>
      <h2>Create Savings Group</h2>
      <input
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Target Amount"
        type="number"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />
      <select value={months} onChange={(e) => setMonths(e.target.value)}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>{m} month(s)</option>
        ))}
      </select>
      <button type="submit">Create Group</button>
    </form>
  );
};

export default CreateGroup;
