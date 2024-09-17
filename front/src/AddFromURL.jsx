import React,{useState} from 'react';

const AddFromURL = () => {

    const [status,setStatus]=useState(0);
    // http://localhost:5173/addurl?orderNumber=12345&customerName=JohnDoe&orderItems=Pizza,Burger,Salad
    const urlParams = new URLSearchParams(window.location.search);

    // Get specific parameters
    const orderNumber = urlParams.get('orderNumber');
    const customerName = urlParams.get('customerName');
    const orderItems = urlParams.get('orderItems');

    // Get the current date and time
    const currentDate = new Date().toLocaleString();

    // Create an object to store the data
    const newOrder = {
        number: orderNumber,
        name: customerName,
        items: orderItems,
        date: currentDate,
        status, status,
    };

    // Retrieve existing orders from localStorage or initialize an empty array
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    // Add the new order to the array
    const updatedOrders = [...existingOrders, newOrder];

    // Save the updated array back to localStorage
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    return (
        <div>
            <p>Order Number: {orderNumber}</p>
            <p>Customer Name: {customerName}</p>
            <p>Order Items: {orderItems}</p>
            <p>Date and Time: {currentDate}</p>
            <p>Order Status: {status}</p>

        </div>
    );
};

export default AddFromURL;
