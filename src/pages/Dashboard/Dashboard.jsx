import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateGroup from "../../components/CreateGroup/CreateGroup";
import Groups from "../../components/Groups/Groups";
import GroupPreview from "../../components/Groups/GroupPreview";
import GroupDetail from "../../components/GroupDetail/GroupDetail";
import UserSwitch from "../../components/UserSwitch/UserSwitch";
import "./Dashboard.scss";

const Dashboard = ({ currentUser, setCurrentUser }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [previewGroup, setPreviewGroup] = useState(null); // ✅ THIS LINE IS REQUIRED
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // Add these to your Dashboard component state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinedGroup, setJoinedGroup] = useState(null);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("storedUsers");
    return saved ? JSON.parse(saved) : [
      "You", "Alice", "Bob", "Charlie", "Diana", "Ethan", "Frank", "Grace",
      "Hannah", "Ivan", "Jenny", "Kyle", "Liam", "Mia", "Noah", "Olivia", "Paul",
      "Quinn", "Riley", "Sophia", "Tyler", "Uma", "Victor", "Telo", "Xavier",
      "Yara", "Zane"
    ];
  });



  const handleAddNewUser = () => {
    const trimmed = newUserName.trim();
    if (!trimmed) return;

    const newList = users.includes(trimmed) ? users : [...users, trimmed];
    setUsers(newList);
    localStorage.setItem("storedUsers", JSON.stringify(newList));

    setNewUserName("");
    setShowAddUserModal(false);
  };

  useEffect(() => {
    localStorage.setItem("storedUsers", JSON.stringify(users));
  }, [users]);




  const handleNavigateToCreate = () => {
    navigate("/create");
  };

  // Load or Seed Groups
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

  // Seed default groups
  const seedGroups = (creatorName) => {
    const groupNames = ["Emergency Fund", "Wedding Trip", "Gaming PC Build", "Business Starter", "Car Downpayment"];
    const userPool = [...users];
    const monthsOptions = [6, 9, 12];
    const seeded = groupNames.map((name, i) => {
      const months = monthsOptions[Math.floor(Math.random() * monthsOptions.length)];
      const target = Math.floor(Math.random() * 1000 + 1000);
      const randomMembers = userPool.sort(() => 0.5 - Math.random()).slice(0, 5);
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

  // Helpers
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

      // ✅ Trigger modal
      setJoinedGroup(updated);
      setShowJoinModal(true);
    }
  };



  const handleDeleteGroup = (groupId) => {
    saveGroups(groups.filter((g) => g.id !== groupId));
    setSelectedGroup(null);
    setPreviewGroup(null);
  };

  const filteredGroups = groups.filter((g) => {
    if (filter === "active") return g.isActive;
    if (filter === "pending") return !g.isActive;
    return true;
  });

  const getUserStats = (user) => {
    const stored = JSON.parse(localStorage.getItem("savingsGroups")) || [];
    const userGroups = stored.filter(g => g.members?.some(m => m.name === user));
    const totalTarget = userGroups.reduce((sum, g) => sum + g.target, 0);
    const completed = userGroups.filter(g =>
      Array.isArray(g.deposits?.[user]) && g.deposits[user].every(Boolean)
    ).length;

    return {
      groupCount: userGroups.length,
      totalTarget: totalTarget.toFixed(2),
      completed
    };
  };

  // UI Views
  const renderPath = () => (
    <div className="dashboard__path">

    </div>
  );

  const renderUserTools = () => (
    <>
      <UserSwitch
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        getUserStats={getUserStats}
      />
    </>
  );

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
      {renderPath()}
      <div className="dashboard__add-user-bar">
        <button className="dashboard__add-user-btn" onClick={() => setShowAddUserModal(true)}>
          ➕ Add New User
        </button>
      </div>

      {!previewGroup && !selectedGroup && renderUserTools()}
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
            groups={filteredGroups}
            currentUser={currentUser}
            onJoin={handleJoinGroup}
            onPreview={setPreviewGroup}
          />
        </>
      )}
      {showAddUserModal && (
        <div className="dashboard__modal-overlay">
          <div className="dashboard__modal">
            <h3>New User</h3>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter user name"
            />
            <button onClick={handleAddNewUser}>Add</button>
            <button className="cancel" onClick={() => setShowAddUserModal(false)}>Cancel</button>
          </div>
        </div>
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
