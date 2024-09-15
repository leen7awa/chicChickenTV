import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CounterIcon from "../icons/CounterIcon";
import KitchenIcon from "../icons/KitchenIcon";
import RestaurantIcon from "../icons/RestaurantIcon";
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
            <div className="bg-[#ffa900] h-screen">
                <nav className="flex justify-center items-center bg-gray-800 p-4">
                    <img src="/icon.png" alt="Logo" className="h-32" />
                </nav>

                <div className="flex justify-center items-center mt-32">
                    <div className="flex flex-row space-x-4 items-center justify-center">

                        <button className="btn btn-primary"
                            onClick={() => navigate("/kitchen")}>
                            <KitchenIcon className="btn-icon" />
                            מטבח
                        </button>

                        <button className="btn btn-primary"
                            onClick={() => navigate("/counter")}>
                            <CounterIcon className="btn-icon" />
                            דלפק
                        </button>

                        <button className="btn btn-primary"
                            onClick={() => navigate("/restaurant")}>
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
