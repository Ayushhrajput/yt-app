import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {getUserChannel, logout} from "../services/authservice.js"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { getAllVideos } from '../services/videoService.js';


function Home(props) {
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
    
    
    if(!user) {
        return (
            <div>Fething user details</div>
        )
    }
    
    return (
        <div className='w-full  flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 '>
             
            
            <div className={` flex-1 ${darkTheme? "bg-black/90 text-white": "bg-white"}  rounded-lg  m-4  overflow-hidden`}>
                <div className='flex flex-col  items-start gap-4'>
                        {user.coverImage?<div className='w-full  h-25 overflow-hidden  '>
                        <img src={user.coverImage} alt=""  className='w-sm h-full object-cover '/>
                    </div>: ""}
                    <div className='flex justify-center items-top gap-4 p-4'>
                        <div className='w-25 h-25 rounded-full overflow-hidden   '>
                            <img src={user.avatar} alt="" className='w-full h-full object-cover'/>
                        </div>
                        <div className='mt-4'>
                            <h1 className='font-bold font-["Pacifico"]'>@{user.username}</h1>
                            <h6>{user.fullName}</h6>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className='px-8 py-3  max-w-sm rounded-lg   bg-linear-to-tl from-red-600 to-red-500 text-white text-bold  mx-4 my-2'
                    >
                        Logout
                    </button>
                    <label htmlFor='theme' className={`${darkTheme? "bg-gray-800 ": "bg-gray-100 items-baseline-last"} w-10 h-10 flex justify-center  rounded-lg`}>
                        {!darkTheme?
                            <span className={`material-symbols-outlined -translate-y-2  transition duration-200`}>light_mode</span>: 
                            <span className={`material-symbols-outlined translate-y-2  transition duration-200`}>dark_mode</span>}
                    </label>
                    <input id='theme' className='hidden' type="checkbox" onChange={() => (
                        !darkTheme?setDarkTheme(true): setDarkTheme(false)
                    )}/>
                </div>
                

            </div>
            
        </div>
    );
}

export default Home;