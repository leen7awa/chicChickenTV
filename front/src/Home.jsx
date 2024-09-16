import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CounterIcon from "../icons/CounterIcon";
import KitchenIcon from "../icons/KitchenIcon";
import RestaurantIcon from "../icons/RestaurantIcon";
import Header from "./Header";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = today.toLocaleDateString('heb-US', options);
    setDate(currentDate);
  }, []);

  // const handleNavigation = (route) => {
  //     const fakeOrderNumber = 1;
  //     const fakeItems = ['burger', 'pizza', 'fries'];

  //     navigate(`${route}?orderNumber=${fakeOrderNumber}&items=${fakeItems.join(',')}`);
  // };

  return (
    <>

<div className="bg-[#ffa900] min-h-screen flex flex-col">

<Header imageUrl="/icon.png" />

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

    </>
  );


};

export default Home;
