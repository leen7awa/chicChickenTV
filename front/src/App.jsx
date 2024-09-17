import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Kitchen from './Kitchen';
import Restaurant from "./Restaurant";
import Counter from "./Counter";

function App() {

  /* 
  Status:
    0 - pending
    1 - prepping
    2 - ready
    3 - finish  
  */
  // sessionStorage.clear();
  // Function to retrieve orders from session storage
  const getOrdersFromSessionStorage = () => {
    const savedOrders = sessionStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [
      {
        orderNumber: 1,
        customerName: 'משה',
        orderItems: ['2 בורגר קריספי', 'קולה','עוף','סלט קיסר','סלט עוף'],
        date: "2024-09-14T15:45:30",
        // date: new Date().toISOString()
        status: 0,
      },
      {
        orderNumber: 2,
        customerName: 'לין',
        orderItems: ['סלט', 'פסטה', '4 תפוזים'],
        date: "2024-09-14T17:33:12",
        status: 0,
      },
    ];
  };

  const [orders, setOrders] = useState(getOrdersFromSessionStorage);

  // Save orders to session storage whenever the orders state updates
  useEffect(() => {
    sessionStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const updateOrderStatus = (orderNumber, newStatus) => {
    console.log("Updating order:", orderNumber, "to status:", newStatus);

    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order.orderNumber === orderNumber ? { ...order, status: newStatus } : order
      );
      console.log("Updated orders:", updatedOrders);
      return updatedOrders;
    });
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kitchen" element={<Kitchen orders={orders} setOrders={setOrders} />} />
          <Route path="/restaurant" element={<Restaurant orders={orders} setOrders={setOrders} />} />
          <Route path="/counter" element={<Counter orders={orders} setOrders={setOrders} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
