import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {getUserChannel, logout} from "../services/authservice.js"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { getAllVideos } from '../services/videoService.js';

function Home(props) {
    const {user, setUser} = useAuth()
    const {darkTheme, setDarkTheme} = useTheme()
    
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchUserChannel = async () => {
            try {
                const response = await getUserChannel(user.username)
                
            } catch (e) {
                console.log("err", e)
            }
        }
        fetchUserChannel()
        const fetchAllVideos = async () => {
            try {
                const options = {
                    page: 1,
                    limit: 10
                }
                const response = await getAllVideos(
                    options
                )
                console.log(response)
            } catch (e) {
                console.log(e)
            }
        }
        fetchAllVideos()
    }, [user])
    
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
        <div className='w-full h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 '>
            <div className={`max-w-sm flex flex-col  items-start gap-4 ${darkTheme? "bg-black/90 text-white": "bg-white"}  rounded-lg shadow-2xl mx-4  overflow-hidden`}>
                {user.coverImage?<div className='w-full  h-25 overflow-hidden  '>
                    <img src={user.coverImage} alt=""  className='w-sm h-full object-cover '/>
                </div>: ""}
                <div className='flex justify-center items-top gap-4 p-4'>
                    <div className='w-25 h-25 rounded-full overflow-hidden   '>
                        <img src={user.avatar} alt="" className='w-full h-full object-cover'/>
                    </div>
                    <div className='mt-4'>
                        <h1 className='font-bold'>@{user.username}</h1>
                        <h6>{user.fullName}</h6>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className='px-8 py-3  max-w-sm rounded-lg   bg-linear-to-tl from-red-500 to-red-400 text-white text-bold  mx-4 my-2'
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
    );
}

export default Home;