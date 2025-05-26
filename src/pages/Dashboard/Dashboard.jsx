// ✅ Dashboard.jsx (Full Complete Code w/ Delete from Preview)

import React, { useEffect, useState } from "react";
import CreateGroup from "../../components/CreateGroup/CreateGroup";
import Groups from "../../components/Groups/Groups";
import GroupPreview from "../../components/Groups/GroupPreview";
import GroupDetail from "../../components/GroupDetail/GroupDetail";
import "./Dashboard.scss";

const Dashboard = ({ currentUser, setCurrentUser }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [previewGroup, setPreviewGroup] = useState(null);
  const [filter, setFilter] = useState("all");

  const users = [
    "You", "Alice", "Bob", "Charlie", "Diana", "Ethan", "Frank", "Grace",
    "Hannah", "Ivan", "Jenny", "Kyle", "Liam", "Mia", "Noah", "Olivia", "Paul",
    "Quinn", "Riley", "Sophia", "Tyler", "Uma", "Victor", "Wendy", "Xavier",
    "Yara", "Zane"
  ];

  const seedGroups = (creatorName) => {
    const groupNames = ["Emergency Fund", "Wedding Trip", "Gaming PC Build", "Business Starter", "Car Downpayment"];
    const userPool = [...users];
    const monthsOptions = [6, 9, 12];
    const groups = [];

    groupNames.forEach((name, i) => {
      const months = monthsOptions[Math.floor(Math.random() * monthsOptions.length)];
      const target = Math.floor(Math.random() * 1000 + 1000);
      const memberLimit = 6;
      const randomMembers = userPool.sort(() => 0.5 - Math.random()).slice(0, memberLimit - 1);
      const members = [
        { id: creatorName.toLowerCase(), name: creatorName },
        ...randomMembers.map(name => ({ id: name.toLowerCase(), name }))
      ];

      const deposits = {};
      members.forEach(m => {
        deposits[m.name] = Array.from({ length: months }, () => Math.random() > 0.4);
      });

      const comments = [
        { user: creatorName, text: "Let’s make this happen!", time: new Date().toLocaleString() },
        { user: members[1].name, text: "Excited to start!", time: new Date().toLocaleString() }
      ];

      groups.push({
        id: Date.now() + i,
        name,
        target,
        months,
        memberLimit,
        members,
        deposits,
        comments,
        isActive: true,
        creator: creatorName,
        monthlyPerUser: parseFloat((target / months / memberLimit).toFixed(2))
      });
    });

    localStorage.setItem("savingsGroups", JSON.stringify(groups));
    setGroups(groups);
  };

  useEffect(() => {
    const stored = localStorage.getItem("savingsGroups");
    if (stored) {
      let parsed = JSON.parse(stored);
      parsed = parsed.map((g) => {
        const fixedMembers = Array.isArray(g.members) ? g.members : [];
        const isActive = fixedMembers.length === 6;
        return {
          ...g,
          members: fixedMembers,
          deposits: typeof g.deposits === "object" ? g.deposits : {},
          comments: Array.isArray(g.comments) ? g.comments : [],
          isActive,
          monthlyPerUser: isActive
            ? parseFloat((g.target / g.months / 6).toFixed(2))
            : g.monthlyPerUser || 0
        };
      });
      setGroups(parsed);
      localStorage.setItem("savingsGroups", JSON.stringify(parsed));
    } else {
      seedGroups(currentUser);
    }
  }, [currentUser]);

  const saveGroups = (updatedGroups) => {
    setGroups(updatedGroups);
    localStorage.setItem("savingsGroups", JSON.stringify(updatedGroups));
  };

  const handleCreateGroup = (group) => {
    const newGroups = [group, ...groups];
    saveGroups(newGroups);
  };

  const updateGroup = (updatedGroup) => {
    const newList = groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
    saveGroups(newList);
  };

  const handleJoinGroup = (group) => {
    const updated = { ...group };
    if (!Array.isArray(updated.members)) updated.members = [];
    const isAlreadyMember = updated.members.some((m) => m.name === currentUser);
    if (!isAlreadyMember && updated.members.length < 6) {
      updated.members.push({ id: currentUser.toLowerCase(), name: currentUser });
      updated.deposits ||= {};
      if (!Array.isArray(updated.deposits[currentUser])) {
        updated.deposits[currentUser] = Array(updated.months).fill(false);
      }
      if (updated.members.length === 6) {
        updated.isActive = true;
        updated.monthlyPerUser = updated.target / updated.months / 6;
        updated.members.forEach((m) => {
          if (!Array.isArray(updated.deposits[m.name])) {
            updated.deposits[m.name] = Array(updated.months).fill(false);
          }
        });
      }
      updateGroup(updated);
    }
  };

  const handleDeleteGroup = (groupId) => {
    const remaining = groups.filter((g) => g.id !== groupId);
    saveGroups(remaining);
    setSelectedGroup(null);
    setPreviewGroup(null);
  };

  const filteredGroups = groups.filter((g) => {
    if (filter === "active") return g.isActive;
    if (filter === "pending") return !g.isActive;
    return true;
  });

  const getUserGroupCount = (user) => {
    const stored = localStorage.getItem("savingsGroups");
    if (!stored) return 0;

    const allGroups = JSON.parse(stored);
    return allGroups.filter(
      (g) => Array.isArray(g.members) && g.members.some((m) => m.name === user)
    ).length;
  };

  const getUserStats = (user) => {
    const stored = localStorage.getItem("savingsGroups");
    if (!stored) return { groupCount: 0, totalTarget: 0, completed: 0 };
  
    const allGroups = JSON.parse(stored);
    const userGroups = allGroups.filter(
      (g) => Array.isArray(g.members) && g.members.some((m) => m.name === user)
    );
  
    const totalTarget = userGroups.reduce((acc, g) => acc + g.target, 0);
  
    const completed = userGroups.filter((group) => {
      const deposits = group.deposits?.[user];
      return Array.isArray(deposits) && deposits.every(Boolean);
    }).length;
  
    return {
      groupCount: userGroups.length,
      totalTarget: totalTarget.toFixed(2),
      completed,
    };
  };
  



  return (
    <div className="dashboard">
      {!previewGroup && !selectedGroup && (
        // src/pages/Dashboard/Dashboard.jsx (within the main return)

        <div className="dashboard__user-grid">
          <p><strong>Simulate User:</strong></p>
          <div className="dashboard__users">
            {users.map((user) => {
              const isActive = user === currentUser;
              const { groupCount, totalTarget, completed } = getUserStats(user);

              return (
                <div
                  key={user}
                  className={`dashboard__user-card ${isActive ? "active" : ""}`}
                  onClick={() => setCurrentUser(user)}
                  title={`${user} - ${groupCount} group(s)`}
                >
                  <div className="dashboard__user-initial">{user.charAt(0)}</div>
                  <div className="dashboard__user-info">
                    <p className="dashboard__user-name">{user}</p>
                    <p className="dashboard__user-groups">{groupCount} group(s)</p>
                    <p className="dashboard__user-total">Total: ${totalTarget}</p>
                    <p className="dashboard__user-completed">✅ {completed} completed</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>




      )}

      <div className="dashboard__path">
        📍 Path: {previewGroup ? `Home > Preview: ${previewGroup.name}` : selectedGroup ? `Home > Group: ${selectedGroup.name}` : "Home"}
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
          onDelete={handleDeleteGroup} // ✅ pass to GroupPreview
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
          <div className="dashboard__filters">
            <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
            <button onClick={() => setFilter("active")} className={filter === "active" ? "active" : ""}>Active</button>
            <button onClick={() => setFilter("pending")} className={filter === "pending" ? "active" : ""}>Pending</button>
          </div>
          <Groups
            groups={filteredGroups}
            currentUser={currentUser}
            onJoin={handleJoinGroup}
            onPreview={setPreviewGroup}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
