import React, { useState, useEffect } from 'react';
import StatusConvert from './StatusConvert';
import Header from './Header';

const socket = new WebSocket('ws://localhost:8081');

const Kitchen = ({ orders, setOrders }) => {
    const [statusFilters, setStatusFilters] = useState([true, true, true]); // Default to show all statuses

    const sendMessage = (orderNumber, newStatus) => {
        const message = JSON.stringify({ orderNumber, status: newStatus });
        socket.send(message); // Send order number and new status to WebSocket
    };

    useEffect(() => {
        socket.onmessage = async (event) => {
            try {
                let messageData;

                const textData = await event.data.text();
                messageData = JSON.parse(textData);

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
                                    height: '300px',
                                    textAlign: 'center',
                                    borderRadius: '20px',
                                }}>

                                <div className='flex flex-col h-full text-gray-800'>
                                    <div className='flex-shrink border-b-2 border-gray-800 font-bold text-xl'>
                                        מספר הזמנה: {order.orderNumber}
                                    </div>
                                    <div className='flex-1 overflow-y-auto'>
                                        <ul>
                                            {order.orderItems.map((item, itemIndex) => (
                                                <li key={itemIndex}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className='flex-shrink flex justify-between  items-end p-4'>
                                        {[
                                            { label: 'בהמתנה', status: 0 },
                                            { label: 'בהכנה', status: 1 },
                                            { label: 'מוכן', status: 2 },
                                        ].map((button, index) => (
                                            <button
                                                key={index}
                                                className={`px-2 py-1 rounded-2xl font-semibold ${order.status === button.status ? 'text-black bg-red-500' : 'bg-slate-300 text-gray-500'}`}
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
        </>
    );
};

export default Kitchen;
