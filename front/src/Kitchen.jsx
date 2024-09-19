import React, { useState, useEffect, useRef } from 'react';
import StatusConvert from './StatusConvert';
import Header from './Header';
import OrderDetailsModal from './OrderDetailsModal';
import './card.css';

const Kitchen = () => {
    const [orders, setOrders] = useState([]); // Initialize with an empty array
    const [statusFilters, setStatusFilters] = useState([true, true, true]); // Default to show all statuses
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // Store the selected order
    const [socket, setSocket] = useState(null); // Store WebSocket instance
    const reconnectAttempts = useRef(0); // Track reconnection attempts
    const isComponentMounted = useRef(true); // Track if the component is still mounted

    const MAX_RECONNECT_ATTEMPTS = 5; // Set a maximum limit for reconnections

    const initializeWebSocket = () => {
        const newSocket = new WebSocket('wss://chic-chicken-oss-929342691ddb.herokuapp.com/');
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log('WebSocket connected');
            reconnectAttempts.current = 0; // Reset reconnection attempts on successful connection
        };

        newSocket.onmessage = (event) => {
            let messageData;
            if (event.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        messageData = JSON.parse(reader.result); // Assuming the blob contains JSON data
                        handleMessage(messageData);
                    } catch (error) {
                        console.error("Error processing Blob WebSocket message:", error);
                    }
                };
                reader.readAsText(event.data);
            } else {
                try {
                    messageData = JSON.parse(event.data);
                    handleMessage(messageData);
                } catch (error) {
                    console.error("Error processing WebSocket message:", error);
                }
            }
        };

        newSocket.onclose = (e) => {
            console.error('WebSocket closed. Reconnecting...', e.reason);
            if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS && isComponentMounted.current) {
                reconnectAttempts.current += 1;
                setTimeout(() => initializeWebSocket(), 3000); // Delay reconnection by 3 seconds
            }
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            newSocket.close(); // Close socket on error to trigger reconnection
        };
    };

    const sendMessage = (orderNumber, newStatus) => {
        const message = JSON.stringify({ orderNumber, status: newStatus });
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message); // Send message to WebSocket server
        }

        // Update order status in the frontend immediately after sending
        setOrders(prevOrders => {
            return prevOrders.map(order =>
                order.orderNumber === orderNumber ? { ...order, status: newStatus } : order
            );
        });
    };

    const handleMessage = (messageData) => {
        console.log("Received WebSocket message:", messageData);

        if (typeof messageData !== 'object') {
            console.error('Expected messageData to be an object, but got:', messageData);
            return;
        }

        setOrders(prevOrders => {
            const orderExists = prevOrders.some(order => order.orderNumber === messageData.orderNumber);
            if (orderExists) {
                return prevOrders.map(order =>
                    order.orderNumber === messageData.orderNumber ? { ...order, ...messageData } : order
                );
            } else {
                return [...prevOrders, messageData];
            }
        });
    };

    useEffect(() => {
        isComponentMounted.current = true;
        initializeWebSocket(); // Initialize WebSocket connection when component mounts

        // Fetch orders from the backend
        const fetchOrders = async () => {
            try {
                const response = await fetch('https://chic-chicken-oss-929342691ddb.herokuapp.com/orders');
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();

        return () => {
            if (socket) {
                socket.close(); // Clean up WebSocket connection on unmount
            }
            isComponentMounted.current = false; // Mark the component as unmounted
        };
    }, []);

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
                                    overflow: 'hidden',
                                }}>

                                <div className='flex flex-col h-full text-gray-800'>
                                    <div className='flex-col font-bold text-base overflow-hidden text-ellipsis'>
                                        <h2 className='text-xl'>מספר הזמנה {order.orderNumber}</h2>
                                        <h4 className='text-base'>שם לקוח: {order.customerName}</h4>
                                        <h4 className='text-base'>{order.date}</h4>
                                    </div>

                                    <div className='flex-1 mt-2 justify-center flex items-center'>
                                        <button
                                            className="px-4 py-1 bg-gray-600 font-bold rounded-2xl border-2 border-gray-800"
                                            onClick={() => {
                                                setSelectedOrder(order); // Set the whole order object
                                                setShowOrderDetails(true); // Show the modal
                                            }}
                                        >
                                            פרטי הזמנה
                                        </button>
                                    </div>

                                    <div className='flex-shrink flex sm:flex-row md:flex-row justify-between items-end p-4'>
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

            {showOrderDetails && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClick={() => setShowOrderDetails(false)}
                />
            )}
        </>
    );
};

export default Kitchen;
