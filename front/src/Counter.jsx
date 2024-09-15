import React, { useState, useEffect } from 'react';
import StatusConvert from './StatusConvert';
const socket = new WebSocket('ws://localhost:8081');

const Counter = ({ orders, setOrders }) => {
    const [status, setStatus] = useState('');

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
                setStatus(`Order ${messageData.orderNumber} status updated to ${messageData.status}`);
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };
    }, [setOrders]);

    return (
        <>
            <div className="bg-[#ffa900] h-screen overflow-y-auto">
                <div className='text-center text-3xl font-bold w-full bg-gray-800 text-[#ffa900] p-4'>דלפק</div>
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
                    {orders && orders.length > 0 ? (
                        orders.map((order, orderIndex) => (
                            order.status < 3 && (
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
                                        <div className='flex-shrink border-b-2 border-gray-800 font-bold'>#{order.orderNumber}</div>
                                        <div className='flex-1 overflow-y-auto'>
                                            <ul>
                                                {order.orderItems.map((item, itemIndex) => (
                                                    <li key={itemIndex}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className='flex-shrink border-y-2 border-gray-800 font-semibold'>סטטוס הזמנה
                                            <br/>
                                            <StatusConvert
                                                status={order.status}
                                            />
                                        </div>
                                        <div className='flex-shrink text-center p-4'>
                                            <button
                                                className="px-2 py-1 bg-gray-200"
                                                onClick={() => sendMessage(order.orderNumber, 3)}>
                                                סיום
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))
                    ) : (
                        <>
                            <div className='text-gray-800 font-mono mt-44 text-3xl font-bold'>אין הזמנות</div>
                        </>
                    )}

                </div>
            </div>
        </>
    );
};

export default Counter;
