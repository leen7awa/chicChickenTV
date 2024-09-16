import React, { useState, useEffect } from 'react';
import StatusConvert from './StatusConvert';
import ConfirmationModal from './ConfirmationModal';
import Header from './Header';
import OrderDetailsModal from './OrderDetailsModal'; // Import your modal component

const socket = new WebSocket('ws://localhost:8081');

const Counter = ({ orders, setOrders }) => {
    const [statusFilters, setStatusFilters] = useState([true, true, true, true]); // Default to show all statuses
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [finishOrderItem, setFinishOrderItem] = useState('');
    const [showOrderDetails, setShowOrderDetails] = useState(false); // State for order details modal
    const [orderDetails, setOrderDetails] = useState([]); // State for order items

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
                <Header title='דלפק' onToggleStatuses={setStatusFilters} /> {/* Pass the toggle handler */}

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
                                    overflow: 'hidden' // Prevent overflow issues
                                }}>
                                <div className='flex flex-col text-gray-800 h-full sm:text-sm md:text-sm'>
                                    <div className='flex-grow font-bold text-xl overflow-hidden text-ellipsis'>
                                        <div>
                                            מספר הזמנה: {order.orderNumber}<br />
                                            סטטוס הזמנה: <StatusConvert status={order.status} />
                                            <br/>שם לקוח
                                        </div>
                                        {/* <div style={{ fontSize: 'smaller' }}>שם לקוח</div> */}
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

                                    <div className='flex-1 text-center p-2'>
                                        <button
                                            className="px-2 py-1 bg-red-500 font-bold rounded-2xl border-2 border-gray-800"
                                            onClick={() => {
                                                setFinishOrderItem(order.orderNumber);
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

                </div>
            </div>

            {showConfirmation && (
                <ConfirmationModal
                    message={<span dir="rtl">לסיים את ההזמנה?</span>}
                    onConfirm={() => {
                        sendMessage(finishOrderItem, 3);
                        setShowConfirmation(false);
                    }}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}

            {showOrderDetails && ( // Show the order details modal when triggered
                <OrderDetailsModal
                    items={orderDetails} // Pass the order items
                    onClick={() => setShowOrderDetails(false)} // Close the modal
                />
            )}

        </>
    );
};

export default Counter;
