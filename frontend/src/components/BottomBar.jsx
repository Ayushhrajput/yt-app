import React, { useEffect, useReducer, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSetting } from '../context/SettingContext';
import { useAuth } from '../context/AuthContext';


function BottomBar(props) {
    const {user} = useAuth()
    const {darkTheme} = useTheme()
    const {items, setItems} = useSetting()
    const [feedPage, setFeedPage] = useState(false)
    
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
    const handlePathClick = (path) => {
        setItems(path === `/profile/${user.username}`)
        
    }
    
    useEffect(() => {
        setFeedPage(location.pathname.startsWith('/feed'))
    }, [location.pathname])
    

    return (
        <nav className="w-full">
            <div className={`fixed ${feedPage? "bottom-4 h-10": "bottom-1 h-14"} left-1/2 -translate-x-1/2  flex justify-around items-center ${darkTheme? "bg-black/10  text-white border-black/20 ": "bg-white/10 border-black/10"} border-t  backdrop-blur  shadow-lg rounded-full max-w-sm px-2 transition-all duration-200`}>
                {navItems.map((item) => 
                    
                    <NavLink
                        key={item.path} 
                        to={item.path}
                        onClick={() => (
                            handlePathClick(item.path)
                        )}
                        className={({isActive}) => ` ${feedPage? "py-1 px-2": "py-2 px-4"}  rounded-full  ${isActive? 'bg-white/40  border-white/20  backdrop-blur border': ''}`}
                    >
                        {item.icon}
                        
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

export default BottomBar;