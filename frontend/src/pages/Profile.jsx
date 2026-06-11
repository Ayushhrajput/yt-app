import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {getUserChannel, logout} from "../services/authservice.js"
import { useTheme } from '../context/ThemeContext.jsx';
import { useSetting } from '../context/SettingContext.jsx';
function Profile(props) {
    const {user, setUser} = useAuth()
    const {darkTheme, setDarkTheme} = useTheme()
    const navigate = useNavigate()
    const {setting} = useSetting()
    

    const handleLogout = async () => {
        try {
            const response = await logout()

            setUser(null)
            navigate("/login")

        } catch (e) {
            throw new Error(e.message)
        }
        
    }

    return (
        <div className={` flex flex-col   h-screen text-blue-600`}>
            {
                setting &&
                <div 
                    onClick={(e) => (
                        e.stopPropagation()
                    )}
                    className={`fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${darkTheme? " bg-black/10 border-black/10": "bg-white/10 border-white/20"} backdrop-blur-2xl shadow-xl border  flex flex-col justify-center items-center w-max  px-2 rounded-xl`}
                >

                    <div className={`flex items-center ${darkTheme? "  border-b-black/20": " border-b-white/20"} border-b border-white px-8 py-2`}>
                        <label htmlFor='theme' className={`${darkTheme? "": " items-baseline-last "} flex justify-center h-10 w-10`}>
                            {!darkTheme?
                                <span className={`material-symbols-outlined -translate-y-2  transition duration-200`}>light_mode</span>: 
                                <span className={`material-symbols-outlined translate-y-2  transition duration-200`}>dark_mode</span>}
                                
                        </label>
                        <label htmlFor="theme">Change Theme</label>
                        <input id='theme' className='hidden' type="checkbox" onChange={() => (
                            !darkTheme?setDarkTheme(true): setDarkTheme(false)
                        )}/>
                    </div>
                    <button
                        onClick={handleLogout}
                        className=' text-red-400 py-2'
                    >
                        Logout
                    </button>
                </div>
            }   
            <div  className=' w-full h-full overflow-y-auto scrollbar-hide'>
                <div className='grid grid-cols-3'>
                    <div className=" h-40 bg-teal-400"></div>
                    <div className=" h-40 bg-blue-400"></div>
                    <div className=" h-40 bg-red-400"></div>
                    <div className=" h-40 bg-blue-400"></div>
                    <div className=" h-40 bg-blue-400"></div>
                    <div className=" h-40 bg-blue-400"></div>
                    <div className=" h-40 bg-blue-400"></div>
                    <div className=" h-40 bg-blue-400"></div>
                    <div className=" h-40 bg-blue-400"></div>
                    <div className=" h-40 bg-blue-400"></div>
                </div>
                    
            </div>
            
        </div>
    );
}

export default Profile;