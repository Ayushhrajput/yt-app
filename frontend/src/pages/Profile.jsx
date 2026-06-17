import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {getUserChannel, logout, getWatchHistory} from "../services/authservice.js"
import { useTheme } from '../context/ThemeContext.jsx';
import { useSetting } from '../context/SettingContext.jsx';

function Profile(props) {
    const {user, setUser} = useAuth()
    const {darkTheme, setDarkTheme} = useTheme()
    const navigate = useNavigate()
    const {setting} = useSetting()
    
    const [channel, setChannel] = useState({})

    useEffect(
        () => {
            const fetchWatchHistory = async () => {
                try {
                    const response = await getWatchHistory()
                    console.log(response)
                } catch (e) {
                    throw new Error(e.message)
                }
            }
            fetchWatchHistory()
        }, []
    )
    useEffect(
        () =>  {
            const getUserChannelInfo = async () => {
                try {
                    const response = await getUserChannel(user.username)
                    setChannel(response.data)
                    
                } catch (e) {
                    throw new Error(e.message)
                }
            }
            getUserChannelInfo()
        }, 
    [user])
    
    

    const handleLogout = async () => {
        try {
            const response = await logout()

            setUser(null)
            navigate("/login")

        } catch (e) {
            throw new Error(e.message)
        }
        
    }
    console.log(channel)

    return (
        <div className={` flex flex-col   h-screen `}>
            
            {
                setting &&
                <div 
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    className={`fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${darkTheme? " bg-black/10 ": "bg-white/10  shadow-white/10"} border-black/10 backdrop-blur shadow-xl border text-blue-500 flex flex-col justify-center items-center w-max  px-2 rounded-xl z-10`}
                >

                    <div className="flex items-center  border-b-black/10 border-b border-white px-8 py-2 h-12">
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
                <div  className=' w-full flex-1  overflow-y-auto scrollbar-hide  flex flex-col '>
                    
                    <div className={`w-full py-2 flex flex-col gap-2 ${darkTheme? "text-white ": ""}border-black/20 border-b`}>
                        <div className='font-semibold italic  items-center gap-2'>
                            <h1 className='px-2'>{user.username}</h1>
                            
                        </div>
                        <div className='flex  w-full md:w-sm  px-4 '> 
                            <img 
                                className='rounded-full h-16 w-16  object-cover '
                                src={user.avatar}
                                alt="avatar" 
                            />
                            <div className='px-2 py-2  flex flex-col justify-center'>
                                
                                <h1>{user.fullName}</h1>
                                <div className='flex justify-items-start w-full text-sm  gap-2 '>
                                    <div className='flex  items-center gap-1'>
                                        <span>No</span>
                                        <p>Posts</p> 
                                    </div>
                                    {
                                        channel._id && 
                                        <div className='flex gap-2'>

                                            <div className='flex  items-center gap-1'>
                                                <span>{channel.subscribersCount}</span>
                                                <p className=''>Subscribers</p>
                                            </div>
                                            <div className='flex  items-center gap-1'>
                                                <span>{channel.subscribedToCount}</span>
                                                <p>subscriptions</p> 
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=' w-full'>

                        <div className='sticky  top-0   '>
                            <div className={`flex mx-4 max-w-sm  gap-2  py-2`}>
                                
                            </div>
                        </div>
                        <div className='grid grid-cols-3  '>
                         
                        </div>
                    </div>
                        
                </div>
            
        </div>
    );
}

export default Profile;