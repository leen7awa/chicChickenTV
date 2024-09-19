import React, { useState, useEffect } from "react";
import RestaurantHeader from "./RestaurantHeader";

const Restaurant = () => {
    const [orders, setOrders] = useState([]); // State to store orders from the database
    const [readyOrders, setReadyOrders] = useState([]);
    const [preppingOrders, setPreppingOrders] = useState([]);
    const [images] = useState([
        "image1.jpg",
        "image2.jpg",
        "image3.jpg",
        "image4.jpg",
        "image5.jpg"
    ]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fetch orders from the backend when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('https://chic-chicken-oss-929342691ddb.herokuapp.com/orders'); // Replace with your backend URL
                const data = await response.json();
                setOrders(data); // Set orders fetched from the backend
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    // WebSocket handling for real-time updates
    useEffect(() => {
        const socket = new WebSocket('wss://chic-chicken-oss-929342691ddb.herokuapp.com/');

        socket.onmessage = (event) => {
            if (event.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const messageData = JSON.parse(reader.result);
                        updateOrders(messageData);
                    } catch (error) {
                        console.error("Error processing Blob WebSocket message:", error);
                    }
                };
                reader.readAsText(event.data);
            } else {
                try {
                    const messageData = JSON.parse(event.data);
                    updateOrders(messageData);
                } catch (error) {
                    console.error("Error processing WebSocket message:", error);
                }
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
        };

        // WebSocket reconnection logic on close
        socket.onclose = () => {
            console.log('WebSocket closed. Attempting reconnection...');
            setTimeout(() => {
                socket = new WebSocket('wss://chic-chicken-oss-929342691ddb.herokuapp.com/');
            }, 5000); // Reconnect after 5 seconds
        };

        const updateOrders = (messageData) => {
            // Update the orders when a message is received from the WebSocket
            setOrders((prevOrders) =>
                prevOrders.map(order =>
                    order.orderNumber === messageData.orderNumber
                        ? { ...order, status: messageData.status }
                        : order
                )
            );
        };

        // Cleanup WebSocket when the component unmounts
        return () => {
            socket.close();
        };
    }, []);

    // Filter orders based on their status
    useEffect(() => {
        const filteredPreppingOrders = orders.filter(order => order.status === 1);
        const filteredReadyOrders = orders.filter(order => order.status === 2);

        setPreppingOrders(filteredPreppingOrders);
        setReadyOrders(filteredReadyOrders);
    }, [orders]);

    // Image carousel effect
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [images.length]);

    return (
        <>
            {/* Top section */}
            <RestaurantHeader />
            
            <div className="flex h-screen text-center text-4xl font-bold bg-yellow-100">
                {/* Prepping Orders Section */}
                <div className="flex-1">
                    <div className="flex-row p-4 font-normal text-2xl">
                        {preppingOrders.map(order => (
                            <div
                                key={order.orderNumber}
                                className="border-black border-b-2 p-2 justify-between flex"
                            >
                                <div className="font-bold text-3xl">{order.orderNumber}</div>
                                <div className="font-bold text-3xl">{order.customerName}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Carousel Section */}
                <div className="flex-grow flex w-32 justify-center items-center">
                    <div className="w-full h-full flex justify-center items-center">
                        <img
                            src={`/images/${images[currentImageIndex]}`}
                            alt={`Restaurant Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-fill"
                        />
                    </div>
                </div>

                {/* Ready Orders Section */}
                <div className="flex-1">
                    <div className="flex-row gap-4 p-4 font-bold text-2xl">
                        {readyOrders.map(order => (
                            <div
                                key={order.orderNumber}
                                className="border-black border-b-2 p-2 justify-between flex"
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
