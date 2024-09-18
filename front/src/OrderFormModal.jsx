import React, { useState, useEffect, useRef } from "react";
import './modal.css';

const OrderFormModal = ({ onClose, onSubmit }) => {
  const [customerName, setCustomerName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderItems, setOrderItems] = useState('');
  const hasSaved = useRef(false); // To track if the order has already been saved
  const [checkSubmit, setCheckSubmit] = useState(false);
  
  const socket = new WebSocket('wss://chic-chicken-oss-929342691ddb.herokuapp.com/');

  // Function to format the current date and time
  const formatDateTime = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!customerName || !orderNumber || !orderItems) {
      alert("Please fill all the fields.");
      return;
    }
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const isOrderNumberExists = existingOrders.some(order => order.orderNumber === orderNumber);

    if (isOrderNumberExists) {
      alert(`Order number ${orderNumber} already exists.`);
      return;
    }

    const itemsArray = orderItems.split(',');
    const newOrder = {
      orderNumber,
      customerName,
      orderItems: itemsArray,
      date: formatDateTime(),
      status: 0, // Initial status
    };

    onSubmit(newOrder);
    saveOrder(newOrder);
    setCheckSubmit(false);
  };

  // Function to save the order and send it via WebSocket
  const saveOrder = (newOrder) => {
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Emit WebSocket message to inform other components
    socket.onopen = () => {
      socket.send(JSON.stringify(newOrder));
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };

    hasSaved.current = true;
  };

  useEffect(() => {
    if (checkSubmit) {
      if (!hasSaved.current && orderNumber && customerName && orderItems) {
        handleSubmit();
      }
    }
  }, [checkSubmit, orderNumber, customerName, orderItems]);

  return (
    <div className="modal-overlay">
      <div className="flex flex-col text-sm modal-content space-y-2 bg-[#fff2cd] border-2 border-gray-800 p-4">
        <h4>הוסף הזמנה חדשה</h4>
        <div className="flex flex-col space-y-2 text-end">
          <label>
            מספר הזמנה
            <input
              type="text"
              className="border w-full p-2"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </label>
          <label>
            שם לקוח
            <input
              type="text"
              className="border w-full p-2"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </label>
          <label>
            פריטי הזמנה (מופרדים בפסיקים):
            <input
              type="text"
              className="border w-full p-2 text-end"
              value={orderItems}
              onChange={(e) => setOrderItems(e.target.value)}
              placeholder="לדוגמה: בורגר, צ'יפס, קולה"
            />
          </label>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setCheckSubmit(true)}
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
