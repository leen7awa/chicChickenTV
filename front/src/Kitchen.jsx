import React, { useState, useEffect } from 'react';
import StatusConvert from './StatusConvert';
import Header from './Header';
import OrderDetailsModal from './OrderDetailsModal'; // Import your modal component

const socket = new WebSocket('https://chickenserver-601a0b60e55d.herokuapp.com/');

const Kitchen = ({ orders, setOrders }) => {
    const [statusFilters, setStatusFilters] = useState([true, true, true]); // Default to show all statuses
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);

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
        socket.onmessage = async (event) => {
            try {
                let messageData;

                const textData = await event.data.text();
                messageData = JSON.parse(textData);

                // Update the orders when a message is received from the WebSocket
                setOrders(prevOrders => prevOrders.map(order =>
                    order.orderNumber === messageData.orderNumber ? { ...order, status: messageData.status } : order
                ));
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };
    }, [setOrders]);

    // Filter orders based on the statusFilters array
    const filteredOrders = orders.filter((order) => statusFilters[order.status]);

    return (
        <>
            <div className="bg-[#ffa900] h-screen overflow-y-auto">
                <Header title='מטבח' onToggleStatuses={setStatusFilters} /> {/* Pass the toggle handler */}
                
                <div
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
                            style={{
                                backgroundColor: 'wheat',
                                border: '2px solid #1a1a1a',
                                width: '300px',
                                height: '200px',
                                textAlign: 'center',
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                                }}>

                                <div className='flex flex-col h-full text-gray-800'>
                                    <div className='flex-grow font-bold text-xl overflow-hidden text-ellipsis'>
                                        <div>
                                            מספר הזמנה: {order.orderNumber}<br />
                                            סטטוס הזמנה: <StatusConvert status={order.status} />
                                            <br />שם לקוח
                                        </div>
                                    </div>

                                    <div className='flex-1 mt-2 justify-center flex items-center'>
                                        <button
                                            className="px-4 py-1 bg-gray-600 font-bold rounded-2xl border-2 border-gray-800"
                                            onClick={() => {
                                                setOrderDetails(order.orderItems); // Set order items
                                                setShowOrderDetails(true); // Show the modal
                                            }}
                                        >
                                            פרטי הזמנה
                                        </button>
                                    </div>

                                    <div className='flex-shrink flex justify-between  items-end p-4'>
                                        {[{ label: 'בהמתנה', status: 0 }, { label: 'בהכנה', status: 1 }, { label: 'מוכן', status: 2 }].map((button, index) => (
                                            <button
                                                key={index}
                                                className={`px-2 py-1 rounded-2xl font-semibold ${order.status === button.status ? 'text-black bg-red-500 border-2 border-gray-800' : 'bg-slate-300 text-gray-500'}`}
                                                onClick={() => sendMessage(order.orderNumber, button.status)}>
                                                {button.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='text-gray-800 font-mono mt-44 text-3xl font-bold'>אין הזמנות</div>
                    )}
                </div>
            </div>

            {showOrderDetails && ( // Show the order details modal when triggered
                <OrderDetailsModal
                    items={orderDetails} // Pass the order items
                    onClick={() => setShowOrderDetails(false)} // Close the modal
                />
            )}
        </>
    );
};

export default Kitchen;
