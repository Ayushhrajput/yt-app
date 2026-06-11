import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';


function Sidebar({className}) {
    const [showSideBar, setShowSideBar] = useState(false)
    const navItems = [
        {
            path: "/home",
            icon: <i class="fa-regular fa-house"></i>,
            label: "Home"
        },
        {
            path: "/search",
            icon: <i class="fa-solid fa-magnifying-glass"></i>,
            label: "Search"
        },
        {
            path: "/postVideo",
            icon: <i class="fa-solid fa-plus"></i>,
            label: "PostVideo"
        },
        {
            path: "/subscriptions",
            icon: <i class="fa-solid fa-video"></i>,
            label: "Subscriptions"
        },
        {
            path: "/profile",
            icon: <i class="fa-solid fa-user"></i>,
            label: "Profile"
        }
    ]

    const handleSidebar = () => {
        setShowSideBar((prev) => !prev)
        console.log(showSideBar)
    }
    return (
        <div className={`${className} ${showSideBar? "w-56": "w-14"} flex flex-col items-center h-full bg-white  transition-all duration-200`}>
            <div className='w-full h-14 flex items-center px-4 ' onClick={handleSidebar}>
                <i class="fa-solid fa-bars"></i>
            </div>
            <div className='flex-1 w-full flex flex-col items-center '>
                <div className={`flex flex-col ${showSideBar? "items-start px-4": "items-center"} w-full gap-8 py-4`}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({isActive}) => `h-6 flex items-center gap-4 ${isActive? "text-gray-900": "text-gray-600"}`}
                        >
                            {item.icon}
                            
                            {showSideBar && 
                                <span>
                                    {item.label}
                                </span>
                            }
                        </NavLink>
                    ))}
                </div>
                <div className='flex-1 flex items-end  p-4'>
                    
                </div>
            </div>

        </div>
    );
}

export default Sidebar;