import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSetting } from '../context/SettingContext';
import { useAuth } from '../context/AuthContext';


function Sidebar({className}) {
    const {darkTheme} = useTheme()
    const {user} = useAuth()
    const {items, setItems} = useSetting()
    const [showSideBar, setShowSideBar] = useState(false)
    const navItems = [
        {
            path: "/home",
            icon: <i class="fa-regular fa-house"></i>,
            label: "Home"
        },
        {
            path: "/feed",
            icon: <i class="fa-solid fa-video"></i>,
            label: "Twitches"
        },
        {
            path: "/postVideo",
            icon: <i class="fa-solid fa-plus"></i>,
            label: "PostVideo"
        },
        {
            path: "/search",
            icon: <i class="fa-solid fa-magnifying-glass"></i>,
            label: "Search"
        },
        {
            path: `/profile/${user.username}`,
            icon: <i class="fa-solid fa-user"></i>,
            label: "Profile"
        }
    ]

    const handleSidebar = () => {
        setShowSideBar((prev) => !prev)
        
    }
    const handlePathClick = (path) => {
        setItems(path === `/profile/${user.username}`)
    }
    return (
        <div className={`${className} ${showSideBar? "w-56": "w-14"} flex flex-col items-center h-full min-h-screen fixed top-0 ${darkTheme? "bg-black/90 text-white border-black/20": "bg-white border-black/20"} border-r shadow-lg transition-all duration-200`}>
            <div className='w-full h-14 flex items-center px-4 ' onClick={handleSidebar}>
                <i class="fa-solid fa-bars"></i>
            </div>
            <div className='flex-1 w-full flex flex-col items-center '>
                <div className={`flex flex-col ${showSideBar? "items-start px-4": "px-4"} w-full gap-8 py-4`}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => (
                                handlePathClick(item.path)
                            )}
                            className={({isActive}) => `h-6 flex items-center gap-4 ${isActive? `${darkTheme? "text-white": "text-gray-900"}`: `${darkTheme? "text-gray-200": "text-gray-600"}`}`}
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