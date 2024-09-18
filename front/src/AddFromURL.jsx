import React, { useState, useEffect, useRef } from 'react';

const AddFromURL = () => {
    const [status] = useState(0);  // Default status
    const hasSaved = useRef(false);  // To track if the order is already saved
    const socket = new WebSocket('wss://chic-chicken-oss-929342691ddb.herokuapp.com/');  // WebSocket connection

    // Retrieve parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('orderNumber');
    const customerName = urlParams.get('customerName');
    const orderItems = urlParams.get('orderItems');

    const currentDate = new Date().toLocaleString();  // Get current date and time

    useEffect(() => {
        if (!hasSaved.current) {
            if (orderNumber && customerName && orderItems) {
                const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];

                // Check if the order number already exists in the saved orders
                const isOrderNumberExists = existingOrders.some(order => order.orderNumber === orderNumber);

                if (!isOrderNumberExists) {
                    // Create new order object
                    const newOrder = {
                        orderNumber,
                        customerName,
                        orderItems: orderItems.split(','),  // Split items by comma
                        date: currentDate,
                        status,
                    };

                    const updatedOrders = [...existingOrders, newOrder];
                    localStorage.setItem('orders', JSON.stringify(updatedOrders));  // Save new order to localStorage

                    // WebSocket: Wait until the connection is open before sending the message
                    socket.onopen = () => {
                        socket.send(JSON.stringify(newOrder));  // Send new order through WebSocket
                    };

                    // WebSocket error handling
                    socket.onerror = (error) => {
                        console.error('WebSocket Error: ', error);
                    };

                    hasSaved.current = true;  // Mark the order as saved
                } else {
                    console.log(`Order with orderNumber ${orderNumber} already exists.`);
                }
            }
        }
    }, [orderNumber, customerName, orderItems, status, currentDate, socket]);

    return (
        <div className='bg-slate-300 justify justify-center'>
            <div className='container text-center'>
                <p>Order Number: {orderNumber}</p>
                <p>Customer Name: {customerName}</p>
                <p>Order Items: {orderItems}</p>
                <p>Date and Time: {currentDate}</p>
                {/* <p>Order Status: {status}</p> */}
            </div>
        </div>
    );
};

export default AddFromURL;
