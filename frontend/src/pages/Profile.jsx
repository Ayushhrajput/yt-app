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
        <div className={`flex flex-col min-h-screen ${darkTheme? "text-white": ""}`}>
            <div>

            </div>
            <div  className=' w-full'>

            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>

                <div className='flex items-center '>
                    <label htmlFor='theme' className={`${darkTheme? "text-white": " items-baseline-last"} flex justify-center h-10 w-10`}>
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
                    className='font-semibold text-red-500'
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Profile;