import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {getUserChannel, logout} from "../services/authservice.js"
import { useTheme } from '../context/ThemeContext.jsx';
function Profile(props) {
    const {user, setUser} = useAuth()
    const {darkTheme, setDarkTheme} = useTheme()
    const navigate = useNavigate()

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
        <div className={` flex flex-col h-screen ${darkTheme? "text-white": ""}`}>
            
            <div  className='h-2/3 w-full  overflow-y-auto scrollbar-hide'>
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
            <div className='flex-1 flex flex-col justify-center items-center'>

                <div className='flex items-center '>
                    <label htmlFor='theme' className={`${darkTheme? "": " items-baseline-last"} flex justify-center h-10 w-10`}>
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
                    className=' text-red-500'
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Profile;