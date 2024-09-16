import React from "react";
import './windowMsg.css';

const OrderDetailsModal = ({ items, onClick }) => {
    return (
        <div className="modal-overlay">
            <div className="flex flex-col text-sm modal-content space-y-2 bg-[#fff2cd] border-2 border-gray-800">
                <div className="flex-1">
                    <div className="justify justify-between text-end text-sm">
                        <h4>שם לקוח</h4>
                        <h4>סטטוס הזמנה</h4>
                        <h4>שעת קבלת הזמנה</h4>
                    </div>
                </div>
                <div className="flex-1">
                    <ul>
                        {items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1 modal-buttons">
                    <button
                        className="button rounded-3xl mt-4 text-base w-fit px-4 py-2 bg-slate-400 hover:bg-slate-500 border-2 border-gray-800"
                        onClick={onClick}
                    >
                        סגור
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
