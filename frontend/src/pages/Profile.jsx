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
        <div className={` flex flex-col   h-screen `}>
            
            {
                setting &&
                <div 
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    className={`fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${darkTheme? " bg-black/10 border-black/10": "bg-white/10 border-white/20 shadow-white/10"} backdrop-blur shadow-xl border text-blue-500 flex flex-col justify-center items-center w-max  px-2 rounded-xl z-10`}
                >

                    <div className={`flex items-center ${darkTheme? "  border-b-black/20": " border-b-white/20"} border-b border-white px-8 py-2 h-12`}>
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
                        className=' py-2 h-12'
                    >
                        Logout
                    </button>
                </div>
            }   
                <div  className=' w-full flex-1  overflow-y-auto scrollbar-hide  flex flex-col'>
                {user.coverImage && 
                    <div className='w-full min-h-max aspect-4/1 overflow-hidden'>
                        <img  
                            className=' object-contain'
                            src={user.coverImage} 
                            alt="coverImg" 
                        />
                    </div>
                }
                <div className={`w-full min-h-40 flex  py-2 ${darkTheme? "text-white": ""}`}>
                    <div className='flex flex-col w-full md:w-sm  px-4 '> 
                        <div className='font-semibold italic flex flex-col gap-2'>
                            <h1 className='px-2'>{user.username}</h1>
                            <img 
                                className='rounded-full h-20 min-w-20 max-w-20 object-cover '
                                src={user.avatar}
                                alt="avatar" 
                            />
                        </div>
                        <div className='px-2'>
                            
                            <h1>{user.fullName}</h1>
                        </div>
                    </div>
                    <div className='flex justify-items-start w-full  gap-4 py-6 px-4 font-semibold'>
                        <div className='flex flex-col items-center gap-4'>
                            <p className=''>Subscribers</p>
                            <span>0</span>
                        </div>
                        <div className='flex flex-col items-center gap-4'>
                            <p>subscribedTo</p> 
                            <span>0</span>
                        </div>
                    </div>
                </div>
                    <div className=' w-full'>

                        <div className='sticky  top-0   '>
                            <div className={`flex mx-4 max-w-sm  gap-2  py-2`}>
                                <h1 className={`px-2 py-1 rounded-full ${darkTheme? "bg-black/20 border-black/20 shadow-black/10 ": "bg-white/20 border-black/10 shadow-black/10 "}  backdrop-blur shadow-xl border text-blue-500`} >Watch History</h1>
                                <h1 className={`px-2 py-1 rounded-full ${darkTheme? "bg-black/20 border-black/20 shadow-black/10 text-white": "bg-white/20 border-black/10 shadow-black/10"}  backdrop-blur shadow-xl border `}>Liked Videos</h1>
                            </div>
                        </div>
                        <div className='grid grid-cols-3   mb-14'>
                            
                            <img className='w-full h-full aspect-3/4  object-cover' src='https://images.pexels.com/photos/37927742/pexels-photo-37927742.jpeg' alt="" />
                            
                            <img className='w-full  h-full aspect-3/4 object-cover ' src="https://images.pexels.com/photos/38020123/pexels-photo-38020123.jpeg" alt="" />
                            <img className='w-full h-full aspect-3/4 object-cover ' src="https://images.pexels.com/photos/37555058/pexels-photo-37555058.jpeg" alt="" />
                            <img className='w-full  h-full aspect-3/4 object-cover ' src="https://images.pexels.com/photos/37810264/pexels-photo-37810264.jpeg" alt="" />
                            <img className='w-full h-full aspect-3/4 object-cover ' src="https://images.pexels.com/photos/27203455/pexels-photo-27203455.jpeg" alt="" />
                            <img className='w-full  h-full aspect-3/4 object-cover ' src="https://images.pexels.com/photos/34914337/pexels-photo-34914337.jpeg" alt="" />
                            <img className='w-full  h-full aspect-3/4 object-cover ' loading='lazy' src="https://images.pexels.com/photos/37911536/pexels-photo-37911536.jpeg" alt="" />
                            <img className='w-full  h-full aspect-3/4 object-cover ' src="https://images.pexels.com/photos/13366067/pexels-photo-13366067.jpeg" alt="" />
                            <img className='w-full  h-full aspect-3/4 object-cover ' src="https://images.pexels.com/photos/37555052/pexels-photo-37555052.jpeg" alt="" />

                            
                            
                        </div>
                    </div>
                        
                </div>
            
        </div>
    );
}

export default Profile;