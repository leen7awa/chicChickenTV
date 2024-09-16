import React from "react";
import './windowMsg.css';

const OrderDetailsModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{message}</h3>
        <div className="modal-buttons">
          <button
            className="button rounded w-fit px-8 py-2 bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            כן
          </button>
          <button
            className="button rounded w-fit px-8 py-2 bg-slate-600 hover:bg-slate-700"
            onClick={onCancel}
          >
            לא
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;