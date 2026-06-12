import React, { useEffect, useReducer } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSetting } from '../context/SettingContext';
import { useAuth } from '../context/AuthContext';


function BottomBar(props) {
    const {user} = useAuth()
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
            path: `/profile/${user.username}`,
            icon: <i class="fa-solid fa-user"></i>,
            label: "Profile"
        }
    ]
    const handlePathClick = (path) => {
        setItems(path === `/profile/${user.username}`)
    }
    

    return (
        <nav className={`fixed bottom-0 left-0 right-0 ${darkTheme? "bg-black/10  text-white border-black/20 ": "bg-white/10 border-black/10"} border-t  backdrop-blur  shadow-lg  `}>
            <div className='h-14 flex justify-around items-center'>
                {navItems.map((item) => 
                    
                    <NavLink
                        key={item.path} 
                        to={item.path}
                        onClick={() => (
                            handlePathClick(item.path)
                        )}
                        className={({isActive}) => `py-2 px-4 rounded-full  ${isActive? 'bg-white/40  border-white/20  backdrop-blur border': ''}`}
                    >
                        {item.icon}
                        
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

export default BottomBar;