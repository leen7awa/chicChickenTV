import React, { useState } from "react";
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
  const [orders, setOrders] = useState([
    {
      orderNumber: 1,
      orderItems: ['בורגר', 'פיצה', 'ציפס', 'קולה', 'דג', 'היי','aaa','bebebe'],
      status: 0,
    },
    {
      orderNumber: 2,
      orderItems: ['salad', 'pasta', 'soup'],
      status: 1,
    },
    {
      orderNumber: 78,
      orderItems: ['salad', 'pasta', 'soup'],
      status: 2,
    },
    {
      orderNumber: 3,
      orderItems: ['salad', 'pasta', 'soup'],
      status: 2,
    },
    {
      orderNumber: 4,
      orderItems: ['salad', 'pasta', 'soup'],
      status: 3,
    },
    {
      orderNumber: 5,
      orderItems: ['salad', 'pasta', 'soup'],
      status: 1,
    },
    {
      orderNumber: 6,
      orderItems: ['salad', 'pasta', 'soup'],
      status: 1,
    },
  ]
  );

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
