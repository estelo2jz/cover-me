// src/components/GroupDetail/GroupDetailWrapper.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GroupDetail from "./GroupDetail";

const GroupDetailWrapper = ({ currentUser }) => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savingsGroups")) || [];
    const match = stored.find((g) => g.id.toString() === id);
    if (match) {
      setGroup(match);
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  const handleUpdate = (updated) => {
    const stored = JSON.parse(localStorage.getItem("savingsGroups")) || [];
    const newList = stored.map((g) => (g.id === updated.id ? updated : g));
    localStorage.setItem("savingsGroups", JSON.stringify(newList));
    setGroup(updated);
  };

  const handleBack = () => navigate(-1);
  const handleDelete = (groupId) => {
    const stored = JSON.parse(localStorage.getItem("savingsGroups")) || [];
    const newList = stored.filter((g) => g.id !== groupId);
    localStorage.setItem("savingsGroups", JSON.stringify(newList));
    navigate("/");
  };

  return group ? (
    <GroupDetail
      group={group}
      currentUser={currentUser}
      onBack={handleBack}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  ) : (
    <p>Loading group...</p>
  );
};

export default GroupDetailWrapper;
