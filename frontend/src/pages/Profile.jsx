import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {getUserChannel, logout, getWatchHistory} from "../services/authservice.js"
import { useTheme } from '../context/ThemeContext.jsx';
import { useFeatures } from '../context/FeaturesContext.jsx';
import { getAllVideos } from '../services/videoService.js';
import LoaderBar from '../components/Loaders/LoaderBar.jsx';

function Profile(props) {
    const {user, setUser} = useAuth()
    const {darkTheme, setDarkTheme} = useTheme()
    const {toast} = useFeatures()
    const navigate = useNavigate()

    const ref = useRef(null)
    
    const [totalPosts, setTotalPosts] = useState(0)
    const [editFeat, setEditFeat] = useState(false)
    const [channel, setChannel] = useState({})
    const [page, setPage] = useState(1)
    const [videos, setVideos] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [isFetching, setIsFetching] = useState(false)
    
    useEffect(() => {
        const handleEditFeat = () => {
        setEditFeat(false)
        }

        window.addEventListener('click', handleEditFeat)

        return () => {window.removeEventListener('click', handleEditFeat)}
    }, [])
    

    useEffect(() => {
        if(isFetching) return
        
        
        
        const fetchVideos = async () => {
            try {
                setIsFetching(true)
                const response = await getAllVideos({
                    page: page,
                    userId: user._id
                })

                setTotalPosts(response.data.pagination.totalVideos)
                
                const newVideos = response.data.videos 
    
                if(newVideos.length < 10) setHasMore(false)
                setVideos(prev => [...prev, ...newVideos])
            } catch (e) {
                console.error(e)
            } finally {
                setIsFetching(false)
            }
        }
        
        fetchVideos()
    }, [page])
    

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if(entries[0].isIntersecting && hasMore && !isFetching) {
                    setPage(prev => prev + 1)
                }   
            }, {
                threshold: 0.7
            }
        )
        if(ref.current) observer.observe(ref.current)

        return () => observer.disconnect()
    }, [hasMore, isFetching, page])

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
    
    
    return (
        <div className={`w-full flex flex-col   h-screen `}>
            
            {
                toast &&
                <div 
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    className={` fixed bottom-0 left-1/2 -translate-x-1/2 ${darkTheme? " bg-black/10 shadow-white/20 border-black/10": "bg-white/10  shadow-black/20 border-white/10"}  backdrop-blur shadow-inner  border text-blue-500 flex flex-col justify-center items-center w-full py-20  px-2  rounded-t-2xl  z-20`}
                >
                    <div className='absolute top-1/12 w-1/4 p-1 bg-white  shadow-inner shadow-black/10 rounded-full '></div>

                    <div className="flex items-center   px-8 py-2 h-12">
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
                        <div className='flex justify-between items-center gap-2 px-4'>
                            <h1 className='font-semibold italic '>{user.username}</h1>
                            <button onClick={(e) => {
                                e.stopPropagation()
                                setEditFeat(true)

                            }} className='text-blue-500 text-sm font-semibold cursor-pointer overflow-hidden'>Edit <i class={`fa-solid fa-caret-down rotate-270 ${editFeat? "translate-x-full transition-transform": "translate-x-0 transition-none"}  duration-100 `}></i></button>
                            
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
                                        <span>{totalPosts}</span>
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

                        <div className='sticky  top-0  '>
                            <div className={`flex mx-4 max-w-sm text-blue-500  py-2 cursor-pointer`}>
                                Your Videos
                            </div>
                        </div>
                        {
                            isFetching &&
                            <LoaderBar className="py-4"/>
                        }

                        <div className='grid grid-cols-3  gap-0.5'>
                            {videos.map((video) => (
                                <div key={video._id}>
                                    <div
                                        className='relative w-full min-h-40  max-w-full aspect-9/16 bg-black '
                                    >   
                                        <img 
                                            className='h-full w-full object-contain'
                                            src={video?.thumbnail} alt="" 
                                            onClick={() => navigate(`/video/${video._id}`)}
                                        />
                                        <div className='absolute bottom-0 right-0 px-1'>
                                            <div className='text-white/60 text-sm'>
                                                {video.views} views
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {
                            !videos.length && !isFetching &&  (
                                <div className='px-4 py-2'>No Videos</div>
                            )
                        }
                        <div ref={ref} className='w-full  '></div>
                    </div>
                        
                </div>
            
        </div>
    );
}

export default Profile;