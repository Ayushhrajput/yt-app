import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {getUserChannel, logout, getWatchHistory, deleteAccount} from "../services/authservice.js"
import { useTheme } from '../context/ThemeContext.jsx';
import { useFeatures } from '../context/FeaturesContext.jsx';
import { deleteVideo, getAllVideos } from '../services/videoService.js';
import LoaderBar from '../components/Loaders/LoaderBar.jsx';
import SearchBox from '../components/SearchBox.jsx';
import { useVideo } from '../context/VideoContext.jsx';

function Profile(props) {
    const {user, setUser} = useAuth()
    const {darkTheme, setDarkTheme} = useTheme()
    const {toast} = useFeatures()
    const {hasVideos} = useVideo()

    const navigate = useNavigate()

    const ref = useRef(null)
    

    const videoRef = useRef(null)
    const [isSticky, setIsSticky] = useState(false)
    const [vidFeat, setVidFeat] = useState(false)
    

    useEffect(() => {
        const handleScroll = () => {
            if(!videoRef.current) return
            const { top } = videoRef.current.getBoundingClientRect()
            setIsSticky(top <= 0)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
        
    }, [])
    
    const [videoId, setVideoId] = useState(null)

    
    const handleDelete = async (videoId) => {
        try {
            

            await deleteVideo(videoId)

            setVideos((prev) => prev.filter((video) => video._id !== videoId))
            setTotalPosts((prev) => prev - 1)
            setVidFeat(false)
            setVideoId(null)
        } catch (e) {
            console.error(e)
        } finally {
            
        }
    }


    
    
    
    const [totalPosts, setTotalPosts] = useState(0)
    const [channel, setChannel] = useState({})
    const [page, setPage] = useState(1)
    const [videos, setVideos] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [isFetching, setIsFetching] = useState(false)
    
    


    useEffect(() => {
        
        const handleEditFeat = () => {
            
            
            setVidFeat(false)
        
        }

        window.addEventListener('click', handleEditFeat)

        return () => window.removeEventListener('click', handleEditFeat)
        
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
            await logout()

            setUser(null)
            navigate("/login")

        } catch (e) {
            throw new Error(e.message)
        }
        
    }
    const handleDeleteAccount = async () => {
    try {
        await deleteAccount()

        setUser(null)
        navigate("/");

    } catch (e) {
        console.log("error")
        throw new Error(e.message)
        
    }
};
    
    
    
    return (
        <div className={`w-full flex flex-col   h-screen `}>
            
            {
                toast &&
                <div 
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    className={`max-w-sm  fixed bottom-0 left-1/2 -translate-x-1/2 animate-[toast_0.4s_ease] ${darkTheme? " bg-black/40  border-white/10 ": "bg-white   border-black/10"}  backdrop-blur-2xl   border flex flex-col justify-center items-center w-full pt-4 pb-2  px-2  rounded-t-3xl  z-20`}
                >
                    <div className={`absolute top-2 w-1/6 p-0.5  ${darkTheme? "bg-white": "bg-black/60"}  rounded-full `}></div>

                    <div className={`flex items-center  justify-center  w-full border-b ${darkTheme? "border-white/10": "border-black/20"}  px-8 py-2 h-12`}>
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
                        className={`w-full border-b py-2 h-12 ${darkTheme? "border-white/10": "border-black/20"}`}
                    >
                        Logout
                    </button>
                    <button 
                        onClick={handleDeleteAccount}
                        className="w-full  py-2 h-12 "
                    >
                        Delete Account
                    </button>
                </div>
            }   
                <div  className=' w-full flex-1  overflow-y-auto scrollbar-hide  flex flex-col '>
                    
                    <div className={`w-full py-2 flex flex-col gap-2 ${darkTheme? "text-white ": ""}border-black/20 border-b`}>
                        <div className='flex justify-between items-center px-4'>
                            <h1 className='font-semibold italic '>{user.username}</h1>
                            <button onClick={(e) => {
                                e.stopPropagation()
                                navigate("/profile/:username/editUserInfo")

                            }} className=' cursor-pointer overflow-hidden'><i class="fa-solid fa-pen-to-square"></i></button>
                            
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
                    
                    <div className=' w-full flex flex-col  items-center'>
                        
                        
                        <div ref={videoRef} className={`sticky  top-0 py-2  w-full  ${isSticky?  ` ${darkTheme? "from-black/70 to-transparent": "from-white to-transparent "} bg-linear-to-b `: "bg-transparent"} z-1`}>
                            <div className={` mx-4   w-max  px-2  ${darkTheme? "border-white/20 bg-black/20 border-t": "border border-black/10 bg-white/20"}  backdrop-blur-2xl    rounded-full cursor-pointer`}>
                                Your Videos
                            </div>
                            
                            <div className='w-full  '>

                                    {
                                        videos.length != 0 && (
                                            <div className=''>

                                                <SearchBox user={user._id} />
                                            </div>
                                        )
                                        
                                    }
                                    {
                                        videos.length == 0 && (
                                            <div className='w-full flex justify-center'>
                                                <div
                                                    onClick={
                                                        () => navigate('/postvideo')
                                                    }
                                                    className={`h-10 w-10 min-w-10  flex justify-center items-center rounded-full ${darkTheme? "border-white/20 bg-black/20 border-t": "border border-black/10 bg-white/20"}  backdrop-blur-2xl  cursor-pointer`}
                                                >
                                                    <i class="fa-solid fa-plus"></i>
                                                </div>
                                            </div>

                                        )
                                    }
                                    
                                    
                            </div>
                        </div>
                        
                        
                        {
                            isFetching &&
                            <LoaderBar className="py-4"/>
                        }

                        {
                            !hasVideos &&(
                                <div className="grid grid-cols-3  gap-0.5 max-w-lg text-white ">
                                    {videos.map((video) => (
                                        <div key={video._id} className=''>
                                            <div
                                                className='relative w-full min-h-40  max-w-full aspect-9/16 bg-black '
                                            >   
                                                <img 
                                                    className='h-full w-full object-cover'
                                                    src={video?.thumbnail} alt="" 
                                                    onClick={() => navigate(`/video/${video._id}`)}
                                                />
                                                <div 

                                                    

                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setVideoId(video._id)
                                                        setVidFeat(true)
                                                        

                                                        
                                                    }
                                                    }
                                                    className='absolute top-0 right-0 w-full py-2 bg-linear-to-b from-black/40 to-transparent flex justify-end cursor-pointer'
                                                >
                                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                                </div>
                                                <div className='absolute bottom-0 right-0 px-2 w-full bg-linear-to-b from-transparent to-black/40 flex justify-end '>
                                                    {video.views} views
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                        
                        
                        
                        {
                            !videos.length && !isFetching &&  (
                                <div>
                                    
                                    <div className='px-4 py-2'>No Videos</div>
                                </div>
                            )
                        }
                        
                        
                        <div ref={ref} className='w-full  '></div>
                    </div>
                    {
                        vidFeat && 
                        (

                            <div
                                
                                className=' px-10 w-full flex justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1 '
                            >

                                <div
                                    
                                    className={`max-w-sm w-full py-2 ${darkTheme? " bg-neutral-700 backdrop-blur-2xl ": " bg-white border  border-black/10"} px-2  h-max      rounded-xl overflow-hidden`}
                                >
                                    
                                    <div 
                                        onClick={(e) => e.stopPropagation()}
                                        className={`w-full  ${darkTheme? " bg-neutral-600 backdrop-blur-2xl ": " bg-gray-200 "} flex flex-col justify-center gap-y-px`}
                                    >
                                        
                                        <button
                                            disabled
                                            onClick={() => {
                                                
                                            }}
                                            className={`w-full px-4  py-2 flex  justify-center gap-x-4 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400 ${darkTheme? " bg-neutral-700": " bg-white"}`}
                                        > <div>
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </div>
                                            Edit Video
                                        </button>
                                        <button
                                            disabled
                                            onClick={() => {

                                            }}
                                            className={`w-full  py-2 px-4 flex justify-center gap-x-4  cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400 ${darkTheme? " bg-neutral-700": " bg-white"}`}
                                        >
                                            <div>
                                                <i class="fa-solid fa-eye-slash"></i>
                                            </div>
                                            Hide Post
                                        </button>
                                        <button
                                            
                                            
                                            onClick={() => {
                                                
                                                handleDelete(videoId)

                                            }}
                                            className={`w-full py-2 px-4 flex justify-center gap-x-4 cursor-pointer ${darkTheme? " bg-neutral-700": " bg-white"}`}
                                        >
                                            <div>
                                                <i class="fa-solid fa-trash"></i>
                                            </div>
                                            Delete
                                            
                                        </button>


                                        
                                    </div>
                                </div>
                            </div>
                        )
                    }
                        
                </div>
            
        </div>
    );
}

export default Profile;