import React, { useState, useEffect } from "react";
// import Header from "./Header";
import RestaurantHeader from "./RestaurantHeader";

const socket = new WebSocket('https://chic-3f6f814fd85b.herokuapp.com/');
// const socket = new WebSocket('ws://localhost:8081');

const Restaurant = ({ orders, setOrders }) => {

    const [status, setStatus] = useState('');

    const [readyOrders, setReadyOrders] = useState([]);
    const [preppingOrders, setPreppingOrders] = useState([]);

    useEffect(() => {
        socket.onmessage = (event) => {
            try {
                // Check if event.data is a Blob
                if (event.data instanceof Blob) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const messageData = JSON.parse(reader.result);
                        
                        // Update the orders when a message is received from the WebSocket
                        setOrders(prevOrders => prevOrders.map(order =>
                            order.orderNumber === messageData.orderNumber ? { ...order, status: messageData.status } : order
                        ));
                    };
                    reader.readAsText(event.data); // Convert Blob to text
                } else {
                    // If it's not a Blob, handle it as JSON
                    const messageData = JSON.parse(event.data);
                    
                    // Update the orders
                    setOrders(prevOrders => prevOrders.map(order =>
                        order.orderNumber === messageData.orderNumber ? { ...order, status: messageData.status } : order
                    ));
                }
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };
    }, [setOrders]);
    

    useEffect(() => {
        const filteredPreppingOrders = orders.filter(order => order.status === 1);
        const filteredReadyOrders = orders.filter(order => order.status === 2);

        setPreppingOrders(filteredPreppingOrders);
        setReadyOrders(filteredReadyOrders);
    }, [orders]);

    const [images] = useState([
        "image1.jpg",
        "image2.jpg",
        "image3.jpg",
        "image4.jpg",
        "image5.jpg"
    ]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <>
            {/* top section */}
                <RestaurantHeader/>
            <div className="flex h-screen text-center text-4xl font-bold bg-yellow-100">
                <div className="flex-1">
                    {/* <h2>הזמנות בהכנה</h2> */}
                    <div className="flex-row p-4 font-normal text-2xl">
                        {preppingOrders.map(order => (
                            <div
                                key={order.orderNumber}
                                className="border-black border-b-2 p-2 justify justify-between flex"
                            >
                                <div className="font-bold text-3xl">{order.orderNumber}</div>
                                <div className="font-bold text-3xl">{order.customerName}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* middle section */}
                <div className="flex-grow flex w-32 justify-center items-center">
                    <div className="w-full h-full flex justify-center items-center">
                        <img
                            src={`/images/${images[currentImageIndex]}`}
                            alt={`Restaurant Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-fill"
                        />
                    </div>
                </div>

                {/* bottom section */}
                <div className="flex-1">
                    {/* <h2>הזמנות מוכנות</h2> */}
                    <div className="flex-row gap-4 p-4 font-bold text-2xl">
                        {readyOrders.map(order => (
                            <div
                            key={order.orderNumber}
                            className="border-black border-b-2 p-2 justify justify-between flex"
                        >
                            <div className="font-bold text-3xl">{order.orderNumber}</div>
                            <div className="font-bold text-3xl">{order.customerName}</div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Restaurant;
