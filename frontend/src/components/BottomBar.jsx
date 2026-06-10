import React from 'react';
import { NavLink } from 'react-router-dom';

function BottomBar(props) {
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
            label: "subscriptions"
        },
        {
            path: "/profile",
            icon: <i class="fa-solid fa-user"></i>,
            label: "profile"
        }
    ]

    return (
        <nav className='fixed bottom-0 left-0 right-0 bg-white shadow-2xl shadow-black'>
            <div className='h-14 flex justify-around items-center'>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path} 
                        to={item.path}
                        className={({isActive}) => ( isActive? "text-gray-900": "text-gray-600")}
                    >
                        {item.icon}
                        
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default BottomBar;