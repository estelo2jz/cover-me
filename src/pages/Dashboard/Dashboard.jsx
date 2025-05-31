import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CreateGroup from "../../components/CreateGroup/CreateGroup";
import Groups from "../../components/Groups/Groups";
import GroupPreview from "../../components/Groups/GroupPreview";
import GroupDetail from "../../components/GroupDetail/GroupDetail";
import User from "../../pages/User/User";

import "./Dashboard.scss";

const Dashboard = ({ currentUser, setCurrentUser }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [previewGroup, setPreviewGroup] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinedGroup, setJoinedGroup] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("savingsGroups");
    if (stored) {
      const parsed = JSON.parse(stored).map(g => {
        const fixedMembers = Array.isArray(g.members) ? g.members : [];
        const isActive = fixedMembers.length === 6;
        return {
          ...g,
          members: fixedMembers,
          deposits: typeof g.deposits === "object" ? g.deposits : {},
          comments: Array.isArray(g.comments) ? g.comments : [],
          isActive,
          monthlyPerUser: isActive ? parseFloat((g.target / g.months / 6).toFixed(2)) : g.monthlyPerUser || 0
        };
      });
      setGroups(parsed);
      localStorage.setItem("savingsGroups", JSON.stringify(parsed));
    } else {
      seedGroups(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (previewGroup || selectedGroup) return;
    let timer;
    if (groups.length > 0 && visibleCount < groups.length) {
      timer = setTimeout(() => setVisibleCount(visibleCount + 1), 100);
    }
    return () => clearTimeout(timer);
  }, [groups, visibleCount, previewGroup, selectedGroup]);

  const seedGroups = (creatorName) => {
    const groupNames = ["Emergency Fund", "Wedding Trip", "Gaming PC Build", "Business Starter", "Car Downpayment"];
    const users = JSON.parse(localStorage.getItem("storedUsers")) || [];
    const monthsOptions = [6, 9, 12];
    const seeded = groupNames.map((name, i) => {
      const months = monthsOptions[Math.floor(Math.random() * monthsOptions.length)];
      const target = Math.floor(Math.random() * 1000 + 1000);
      const randomMembers = users.sort(() => 0.5 - Math.random()).slice(0, 5);
      const members = [
        { id: creatorName.toLowerCase(), name: creatorName },
        ...randomMembers.map(n => ({ id: n.toLowerCase(), name: n }))
      ];
      const deposits = {};
      members.forEach(m => {
        deposits[m.name] = Array.from({ length: months }, () => Math.random() > 0.4);
      });
      return {
        id: Date.now() + i,
        name,
        target,
        months,
        memberLimit: 6,
        members,
        deposits,
        comments: [
          { user: creatorName, text: "Let’s make this happen!", time: new Date().toLocaleString() },
          { user: members[1].name, text: "Excited to start!", time: new Date().toLocaleString() }
        ],
        isActive: true,
        creator: creatorName,
        monthlyPerUser: parseFloat((target / months / 6).toFixed(2))
      };
    });

    localStorage.setItem("savingsGroups", JSON.stringify(seeded));
    setGroups(seeded);
  };

  const saveGroups = (updated) => {
    setGroups(updated);
    localStorage.setItem("savingsGroups", JSON.stringify(updated));
  };

  const updateGroup = (updatedGroup) => {
    const newList = groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
    saveGroups(newList);
  };

  const handleCreateGroup = (group) => {
    saveGroups([group, ...groups]);
  };

  const handleJoinGroup = (group) => {
    const updated = { ...group };
    updated.members ||= [];

    const isAlreadyMember = updated.members.some((m) => m.name === currentUser);
    if (!isAlreadyMember && updated.members.length < 6) {
      updated.members.push({ id: currentUser.toLowerCase(), name: currentUser });
      updated.deposits ||= {};
      updated.deposits[currentUser] = Array(updated.months).fill(false);

      if (updated.members.length === 6) {
        updated.isActive = true;
        updated.monthlyPerUser = updated.target / updated.months / 6;
        updated.members.forEach((m) => {
          updated.deposits[m.name] ||= Array(updated.months).fill(false);
        });
      }

      updateGroup(updated);
      setJoinedGroup(updated);
      setShowJoinModal(true);
    }
  };

  const handleDeleteGroup = (groupId) => {
    saveGroups(groups.filter((g) => g.id !== groupId));
    setSelectedGroup(null);
    setPreviewGroup(null);
  };

  const handleNavigateToCreate = () => {
    navigate("/create");
  };

  const filteredGroups = groups.filter((g) => {
    if (filter === "active") return g.isActive;
    if (filter === "pending") return !g.isActive;
    return true;
  });

  const visibleGroups = filteredGroups.slice(0, visibleCount);

  const renderGroupFilters = () => (
    <div className="dashboard__filters">
      {["all", "active", "pending"].map((type) => (
        <button
          key={type}
          className={filter === type ? "active" : ""}
          onClick={() => setFilter(type)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard__create-btn-wrapper">
        <button className="dashboard__create-btn" onClick={handleNavigateToCreate}>
          ➕ New Group
        </button>
      </div>

      {previewGroup ? (
        <GroupPreview
          group={previewGroup}
          currentUser={currentUser}
          onBack={() => setPreviewGroup(null)}
          onJoin={(group) => {
            handleJoinGroup(group);
            setPreviewGroup(null);
            setSelectedGroup(group);
          }}
          onDelete={handleDeleteGroup}
        />
      ) : selectedGroup ? (
        <GroupDetail
          group={selectedGroup}
          currentUser={currentUser}
          onBack={() => setSelectedGroup(null)}
          onUpdate={updateGroup}
          onDelete={handleDeleteGroup}
        />
      ) : (
        <>
          {renderGroupFilters()}
          <Groups
            groups={visibleGroups}
            currentUser={currentUser}
            onJoin={handleJoinGroup}
            onPreview={setPreviewGroup}
          />
        </>
      )}

      {showJoinModal && (
        <div className="dashboard__modal-overlay">
          <div className="dashboard__modal">
            <h3>🎉 Joined Successfully</h3>
            <p>You’ve joined <strong>{joinedGroup.name}</strong>.</p>
            <p>Would you like to view the group details now?</p>

            <div className="dashboard__modal-buttons">
              <button
                className="confirm-btn"
                onClick={() => {
                  setSelectedGroup(joinedGroup);
                  setPreviewGroup(null);
                  setShowJoinModal(false);
                  setJoinedGroup(null);
                }}
              >
                Yes, View Group
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinedGroup(null);
                }}
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
