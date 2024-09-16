import React, { useState, useEffect } from 'react';
import './Header.css'
const Header = ({ title, imageUrl }) => {
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const updateDateTime = () => {
            const today = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            const date = today.toLocaleDateString('heb-US', options);

            // Format time as HH:MM:SS
            const time = today.toLocaleTimeString('heb-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });

            setCurrentDate(date);
            setCurrentTime(time);
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <nav className="flex bg-gray-800 text-[#ffa900] max-h-44 p-4 justify-between">
            <div className="flex-1">
                {title === 'דלפק' && (
                    <div className="w-fit mx-auto text-center">סינון לפי סטטוס
                        <div className="absolute mt-2 mx-auto rounded-md shadow-lg py-2 space-x-4">
                            {['בהמתנה', 'בהכנה', 'מוכן', 'סיום'].map((status, index) => (
                                <label key={index} className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ms-3 text-sm font-medium">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 text-center text-3xl font-bold">
                {imageUrl ? (
                    <img src={imageUrl} alt="Logo" className="h-auto mx-auto" />
                ) : (
                    title
                )}
            </div>
            <div className="flex-1 text-right font-bold">
                <div>{currentDate}</div>
                <div className="lg:mr-16">{currentTime}</div>
            </div>
        </nav>
    );
};

export default Header;
