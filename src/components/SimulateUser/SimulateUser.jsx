// src/components/SimulateUser/SimulateUser.jsx
import React, { useEffect, useState } from "react";
import "./SimulateUser.scss";

const LOCAL_KEY = "simulatedUsers";

const SimulateUser = ({ currentUser, setCurrentUser }) => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", avatar: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) setUsers(JSON.parse(stored));
    else {
      const initial = [
        { name: "Alice", avatar: "" },
        { name: "Bob", avatar: "" },
        { name: "Charlie", avatar: "" }
      ];
      setUsers(initial);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(initial));
    }
  }, []);

  const openModal = (user = { name: "", avatar: "" }, index = null) => {
    setForm(user);
    setEditIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ name: "", avatar: "" });
    setEditIndex(null);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const updated = [...users];
    if (editIndex !== null) updated[editIndex] = form;
    else updated.push(form);
    setUsers(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    closeModal();
  };

  const handleDelete = (index) => {
    const updated = [...users];
    const removed = updated.splice(index, 1);
    if (removed[0].name === currentUser) setCurrentUser(users[0]?.name || "");
    setUsers(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="simulate-user">
      <div className="simulate-user__header">
        <p><strong>Simulate User:</strong></p>
        <button onClick={() => openModal()} className="simulate-user__add-btn">+ Add User</button>
      </div>

      <div className="simulate-user__grid">
        {users.map((user, i) => (
          <div
            key={user.name}
            className={`simulate-user__card ${user.name === currentUser ? "active" : ""}`}
          >
            <div
              className="simulate-user__avatar"
              onClick={() => setCurrentUser(user.name)}
              onDoubleClick={() => openModal(user, i)}
              title="Double-click to edit"
            >
              {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name.charAt(0)}
            </div>
            <p>{user.name}</p>
            <button className="simulate-user__delete" onClick={() => handleDelete(i)}>🗑️</button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="simulate-user__modal" onClick={(e) => {
          if (e.target.classList.contains("simulate-user__modal")) closeModal();
        }}>
          <div className="simulate-user__modal-content">
            <button className="simulate-user__modal-close" onClick={closeModal}>❌</button>
            <h3>{editIndex !== null ? "Edit User" : "Add New User"}</h3>

            <input
              type="text"
              placeholder="User name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input type="file" accept="image/*" onChange={handleAvatarUpload} />

            <div className="simulate-user__modal-avatar-preview">
              {form.avatar ? (
                <img src={form.avatar} alt="preview" />
              ) : (
                <div className="simulate-user__avatar-fallback">{form.name.charAt(0)}</div>
              )}
            </div>

            <button onClick={handleSave}>{editIndex !== null ? "Update" : "Save"}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulateUser;
