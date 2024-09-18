// http://localhost:5173/addurl?orderNumber=6&customerName=לולי&orderItems=פיצה,בורגר,סלט
import React, { useState, useEffect, useRef } from 'react';

const AddFromURL = () => {
    const [status] = useState(0);
    const hasSaved = useRef(false);
    // const socket = new WebSocket('ws://localhost:8081'); // Use the same WebSocket URL
    const socket = new WebSocket('wss://chic-chicken-oss-929342691ddb.herokuapp.com/');

    // Retrieve parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('orderNumber');
    const customerName = urlParams.get('customerName');
    const orderItems = urlParams.get('orderItems');

    const currentDate = new Date().toLocaleString();

    useEffect(() => {
        if (!hasSaved.current) {
            if (orderNumber && customerName && orderItems) {
                const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];

                const isOrderNumberExists = existingOrders.some(order => order.orderNumber === orderNumber);

                if (!isOrderNumberExists) {
                    const newOrder = {
                        orderNumber,
                        customerName,
                        orderItems: orderItems.split(','),
                        date: currentDate,
                        status,
                    };

                    const updatedOrders = [...existingOrders, newOrder];
                    localStorage.setItem('orders', JSON.stringify(updatedOrders));

                    // Emit WebSocket message to inform other components
                    socket.onopen = () => {
                        socket.send(JSON.stringify(newOrder)); // Send new order through WebSocket
                    };

                    hasSaved.current = true;
                } else {
                    console.log(`Order with orderNumber ${orderNumber} already exists.`);
                }
            }
        }
    }, [orderNumber, customerName, orderItems, status]);

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

