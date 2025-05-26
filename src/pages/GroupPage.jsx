// src/pages/GroupPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GroupDetail from "../components/GroupDetail/GroupDetail";

const GroupPage = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("savingsGroups");
    if (stored) {
      const allGroups = JSON.parse(stored);
      const found = allGroups.find(g => String(g.id) === id);
      if (found) {
        setGroup(found);
      } else {
        navigate("/"); // redirect if not found
      }
    }
  }, [id, navigate]);

  const updateGroup = (updatedGroup) => {
    const stored = JSON.parse(localStorage.getItem("savingsGroups"));
    const newList = stored.map(g => g.id === updatedGroup.id ? updatedGroup : g);
    localStorage.setItem("savingsGroups", JSON.stringify(newList));
    setGroup(updatedGroup);
  };

  return (
    <div className="group-page">
      {group ? (
        <GroupDetail
          group={group}
          currentUser={currentUser}
          onBack={() => navigate(-1)}
          onUpdate={updateGroup}
        />
      ) : (
        <p>Loading group...</p>
      )}
    </div>
  );
};

export default GroupPage;
