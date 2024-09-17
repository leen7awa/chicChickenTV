import React, { useState, useEffect } from "react";
import Header from "./Header";
// const socket = new WebSocket('https://chickenserver-601a0b60e55d.herokuapp.com/');
const socket = new WebSocket('ws://localhost:8081');
const Restaurant = ({ orders, setOrders }) => {

    const [status, setStatus] = useState('');

    const [readyOrders, setReadyOrders] = useState([]);
    const [preppingOrders, setPreppingOrders] = useState([]);

    useEffect(() => {
        socket.onmessage = async (event) => {
            try {
                let messageData;

                const textData = await event.data.text(); // Convert Blob to text
                messageData = JSON.parse(textData);       // Parse the text to JSON

                // Update the orders array with the new status
                setOrders(prevOrders => {
                    const updatedOrders = prevOrders.map(order =>
                        order.orderNumber === messageData.orderNumber ? { ...order, status: messageData.status } : order
                    );
                    return updatedOrders; // Returning updated orders to save to session storage in App component
                });
                setStatus(`Order ${messageData.orderNumber} status updated to ${messageData.status}`);
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
                <Header title={''}/>
            <div className="flex h-screen text-center text-4xl font-bold bg-yellow-100">
                <div className="flex-1">
                    <h2>הזמנות בהכנה</h2>
                    <div className="flex-row p-4 font-normal text-2xl">
                        {preppingOrders.map(order => (
                            <div
                                key={order.orderNumber}
                                className="border-black border-b-2 p-2"
                            >
                                <div className="font-bold text-3xl">{order.orderNumber} + name</div>
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
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* bottom section */}
                <div className="flex-1">
                    <h2>הזמנות מוכנות</h2>
                    <div className="flex-row gap-4 p-4 font-bold text-2xl">
                        {readyOrders.map(order => (
                            <div
                                key={order.orderNumber}
                                className="border-black border-b-2 p-2"
                            >
                                <div className="font-bold text-3xl">{order.orderNumber} + name?</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Restaurant;
