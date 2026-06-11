import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSetting } from '../context/SettingContext';


function BottomBar(props) {

    const {darkTheme} = useTheme()
    const {items, setItems} = useSetting()
    
    
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
    const handlePathClick = (path) => {
        setItems(path === "/profile")
    }
    

    return (
        <nav className={`fixed bottom-0 left-0 right-0 ${darkTheme? "bg-gray-900 shadow-gray-100 ": "bg-white shadow-gray-900 "}  shadow-lg  `}>
            <div className='h-14 flex justify-around items-center'>
                {navItems.map((item) => 
                    
                    <NavLink
                        key={item.path} 
                        to={item.path}
                        onClick={() => (
                            handlePathClick(item.path)
                        )}
                        className={({isActive}) => ( isActive? `${darkTheme? "text-white": "text-gray-900"}`: `${darkTheme? "text-gray-200": "text-gray-600"}`)}
                    >
                        {item.icon}
                        
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

export default BottomBar;