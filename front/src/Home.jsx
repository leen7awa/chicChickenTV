import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CounterIcon from "../icons/CounterIcon";
import KitchenIcon from "../icons/KitchenIcon";
import RestaurantIcon from "../icons/RestaurantIcon";
import Header from "./Header";
import './Home.css';
import OrderFormModal from "./OrderFormModal"; // Import the modal component
import AddFromURL from "./AddFromURL";

const Home = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = today.toLocaleDateString('heb-US', options);
    setDate(currentDate);
  }, []);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  const handleAddOrder = (newOrder) => {
    const formatDateTime = () => {
      const today = new Date();

      // Format date: dd/mm/yy
      const day = String(today.getDate()).padStart(2, '0');  // Get day and pad with zero if needed
      const month = String(today.getMonth() + 1).padStart(2, '0');  // Get month (January is 0, so add 1)
      const year = String(today.getFullYear()).slice(-2);  // Get last 2 digits of the year

      // Format time: HH:mm:ss
      const hours = String(today.getHours()).padStart(2, '0');  // Get hours and pad with zero if needed
      const minutes = String(today.getMinutes()).padStart(2, '0');  // Get minutes and pad with zero if needed
      const seconds = String(today.getSeconds()).padStart(2, '0');  // Get seconds and pad with zero if needed

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;  // Combine date and time
    };

    const orderNumber = orders.length + 1;
    const orderWithNumber = {
      ...newOrder,
      orderNumber,
      date: formatDateTime(),  // Use the updated formatDateTime function
      status: 0,
    };

    const updatedOrders = [...orders, orderWithNumber];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders)); // Using localStorage here
    setModalOpen(false); // Close the modal
  };




  return (
    <>
      <div className="bg-[#ffa900] min-h-screen flex flex-col">
        <Header imageUrl="/icon.png" />

        {/* Button to open modal */}
        <div className="flex flex-1 w-fit ml-[550px] mt-8">
          <button
            className="border-2 border-gray-700 rounded-2xl bg-slate-200 h-fit px-8"
            onClick={() => setModalOpen(true)}
          >
            הוספת הזמנה
          </button>
          <button
            className="border-2 border-gray-700 rounded-2xl bg-slate-200 h-fit px-8"
            onClick={() => navigate("/addurl")}
          >
            add from url          </button>
        </div>

        <div className="flex-grow flex justify-center items-center">
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 items-center">
            <button className="btn btn-primary" onClick={() => navigate("/kitchen")}>
              <KitchenIcon className="btn-icon" />
              מטבח
            </button>

            <button className="btn btn-primary" onClick={() => navigate("/counter")}>
              <CounterIcon className="btn-icon" />
              דלפק
            </button>

            <button className="btn btn-primary" onClick={() => navigate("/restaurant")}>
              <RestaurantIcon className="btn-icon" />
              מסעדה
            </button>
          </div>
        </div>
      </div>

      {/* Modal for adding new order */}
      {modalOpen && (
        <OrderFormModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddOrder}
        />
      )}
    </>
  );
};

export default Home;
