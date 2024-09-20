import React, { useState, useEffect } from 'react';
import StatusConvert from './StatusConvert';
import ConfirmationModal from './ConfirmationModal';
import OrderDetailsModal from './OrderDetailsModal'; // Import your modal component
import Header from './Header';
import './card.css';

const socket = new WebSocket('wss://chic-chicken-oss-929342691ddb.herokuapp.com/');
// const socket = new WebSocket('ws://localhost:8081');

const Counter = ({ orders, setOrders }) => {
    const [statusFilters, setStatusFilters] = useState([false, false, true, false]); // Default to show all statuses
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [finishOrderItem, setFinishOrderItem] = useState('');
    const [showOrderDetails, setShowOrderDetails] = useState(false); // State for order details modal
    const [orderDetails, setOrderDetails] = useState([]); // State for order items
    const [selectedOrder, setSelectedOrder] = useState(null);

    const sendMessage = (orderNumber, newStatus) => {
        const message = JSON.stringify({ orderNumber, status: newStatus });
        socket.send(message); // Send order number and new status to WebSocket

        // Update order status in the frontend immediately after sending the WebSocket message
        setOrders(prevOrders => {
            const updatedOrders = prevOrders.map(order =>
                order.orderNumber === orderNumber ? { ...order, status: newStatus } : order
            );
            return updatedOrders;
        });
    };

    useEffect(() => {
        socket.onmessage = (event) => {
            try {
                // Check if event.data is a Blob
                if (event.data instanceof Blob) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const messageData = JSON.parse(reader.result);
                        
                        setOrders(prevOrders => {
                            const orderExists = prevOrders.some(order => order.orderNumber === messageData.orderNumber);
        
                            if (orderExists) {
                                // Update the order if it already exists
                                return prevOrders.map(order =>
                                    order.orderNumber === messageData.orderNumber ? { ...order, status: messageData.status } : order
                                );
                            } else {
                                // Add the new order if it doesn't exist
                                return [...prevOrders, messageData];
                            }
                        });
                    };
                    reader.readAsText(event.data); // Convert Blob to text
                } else {
                    // If it's not a Blob, handle it as JSON
                    const messageData = JSON.parse(event.data);
                    
                    setOrders(prevOrders => {
                        const orderExists = prevOrders.some(order => order.orderNumber === messageData.orderNumber);
        
                        if (orderExists) {
                            // Update the order if it already exists
                            return prevOrders.map(order =>
                                order.orderNumber === messageData.orderNumber ? { ...order, status: messageData.status } : order
                            );
                        } else {
                            // Add the new order if it doesn't exist
                            return [...prevOrders, messageData];
                        }
                    });
                }
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };
    }, [setOrders]);
    


    // Filter orders to include only those with status < 3
    const filteredOrders = orders.filter((order) => statusFilters[order.status]);

    return (
        <>
            <div className="bg-[#ffa900] h-screen overflow-y-auto">
                <Header title='דלפק' onToggleStatuses={setStatusFilters} /> {/* Pass the toggle handler */}

                {<div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px',
                        marginTop: '20px',
                        margin: '20px',
                        justifyContent: 'center'
                    }}
                >
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, orderIndex) => (
                            <div
                                key={orderIndex}
                                className="order-card"
                                style={{
                                    backgroundColor: 'wheat',
                                    border: '2px solid #1a1a1a',
                                    width: '300px',
                                    height: '200px',
                                    textAlign: 'center',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden' // Prevent overflow issues
                                }}>
                                <div className='flex flex-col h-full text-gray-800'>
                                    <div className='flex-col font-bold text-base overflow-hidden text-ellipsis'>
                                        <h2 className='text-xl sm:text-base md:text-base'>מספר הזמנה {order.orderNumber}</h2>
                                        <h4 className='text-base'> סטטוס הזמנה:
                                            <span className='border-b-2 border-blue-500'>
                                                <StatusConvert status={order.status} />
                                            </span>
                                        </h4>
                                        <h4 className='text-base'>שם לקוח: {order.customerName}</h4>
                                        <h4 className='text-base'>{order.date}</h4>
                                    </div>

                                    <div className='flex-1 mt-2 justify-center flex items-center'>
                                        <button
                                            className="px-4 py-1 bg-gray-600 font-bold rounded-2xl border-2 border-gray-800"
                                            onClick={() => {
                                                setSelectedOrder(order);// Set order items
                                                setShowOrderDetails(true); // Show the modal
                                            }}
                                        >
                                            פרטי הזמנה
                                        </button>
                                    </div>

                                    <div className='flex-1 text-center p-2'>
                                        <button
                                            className="px-2 py-1 bg-red-500 font-bold rounded-2xl border-2 border-gray-800"
                                            onClick={() => {
                                                setFinishOrderItem(order);
                                                setShowConfirmation(true);
                                            }}
                                        >
                                            סיום
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='text-gray-800 font-mono mt-44 text-3xl font-bold'>אין הזמנות</div>
                    )}
                </div>}
            </div>

            {showConfirmation && (
                <ConfirmationModal
                    message={<span dir="rtl">לסיים את ההזמנה?</span>}
                    onConfirm={() => {
                        // sendMessage(finishOrderItem,3);
                        // Remove the order from the list and update local storage
                        setOrders(prevOrders => {
                            // Filter out the finished order
                            const updatedOrders = prevOrders.filter(order => order.orderNumber !== finishOrderItem.orderNumber);

                            // Update local storage to reflect the deletion
                            localStorage.setItem('orders', JSON.stringify(updatedOrders));

                            return updatedOrders;
                        });

                        // Close the confirmation modal
                        setShowConfirmation(false);
                    }}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}




            {showOrderDetails && selectedOrder && ( // Show the order details modal when triggered
                <OrderDetailsModal
                    order={selectedOrder} // Pass the selected order object
                    onClick={() => setShowOrderDetails(false)} // Close the modal
                />
            )}
        </>
    );
};

export default Counter;
