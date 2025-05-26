// src/components/Modal/Modal.jsx
import React from "react";
import "./Modal.scss";

const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal__actions">
          <button className="modal__cancel" onClick={onCancel}>Cancel</button>
          <button className="modal__confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
