import React, { useState } from "react";
import './windowMsg.css';

const OrderFormModal = ({ onClose, onSubmit }) => {
  const [customerName, setCustomerName] = useState('');
  const [orderItems, setOrderItems] = useState('');
  
  const handleSubmit = () => {
    const itemsArray = orderItems.split(',').map(item => item.trim());
    onSubmit({
      customerName,
      orderItems: itemsArray,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="flex flex-col text-sm modal-content space-y-2 bg-[#fff2cd] border-2 border-gray-800 p-4">
        <h4>הוסף הזמנה חדשה</h4>
        <div className="flex flex-col space-y-2">
          <label>
            שם לקוח:
            <input
              type="text"
              className="border w-full p-2"
              // customerName = 'khkh'
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </label>
          <label>
            פריטי הזמנה (מופרדים בפסיקים):
            <input
              type="text"
              className="border w-full p-2"
              value={orderItems}
              onChange={(e) => setOrderItems(e.target.value)}
              placeholder="לדוגמה: בורגר, צ'יפס, קולה"
            />
          </label>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            שמור
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFormModal;
