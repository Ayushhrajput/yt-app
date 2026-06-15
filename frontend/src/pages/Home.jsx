import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVideos } from '../services/videoService.js';
import { useTheme } from '../context/ThemeContext.jsx';

function Home(props) {
    const [videos, setVideos] = useState([])
    const [showDes, setShowDes] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [fetch, setFetch] = useState(false)

    const {darkTheme} = useTheme()
    const videoRef = useRef(null)

    const navigate = useNavigate()
    useEffect(() => {
        
        const fetchAllVideos = async() => {
            
            if(fetch) return
           
            setFetch(true)

            try {
                const response = await getAllVideos(
                    {
                        page
                    }
                )
                const newVideos = response.data.videos
                setVideos((prev) => [...prev, ...newVideos])
                
                if(newVideos.length < 10) {
                    setHasMore(false)
                }

            } catch (e) {
                throw new Error(e.message)
            } finally {
                setFetch(false)
            }
        }
        fetchAllVideos()
    }, [page])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if(entries[0].isIntersecting && hasMore && !fetch) {
                    setPage(prev => prev + 1)
                }
            }, {
                threshold: 1
            }
        )

        if(videoRef.current) {
            observer.observe(videoRef.current)
        }

        return () => observer.disconnect()
    }, [hasMore, fetch])

    


    return (
        <div className=' w-full min-h-screen '>
            {videos.map((video) => 
                <div
                    key={video._id}
                    className={`flex flex-col border-b ${darkTheme? "": "border-gray-200"} relative`}
                >   
                    <div className='absolute flex items-center w-full gap-2 py-2 px-4 text-white'>
                        <div className='w-10 h-10 border border-blue-500 rounded-full'>

                        <img src={video.owner.avatar} alt={video.title} className='w-full h-full object-cover rounded-full p-0.5' />
                        </div>
                        <span>
                            {video.owner.username}
                        </span>
                    </div>
                    <div className='w-full flex items-center justify-center bg-black'>

                        <div className='w-full max-w-sm aspect-9/16 overflow-hidden bg-black'>
                            <img 
                                className='w-full  h-full object-cover'
                                src={video.thumbnail} 
                                alt={video.title} 
                                onClick={() => {
                                navigate(`/home/video/${video._id}`)
                                
                            }}/>
                        </div>
                    </div>
                    <div className='flex  flex-col  w-full gap-2 py-2 px-4'>
                        <div className=' flex'>
                            <div className='font-semibold'>
                                {video.owner.username}
                            </div>
                            <span className='px-2'>
                                {video.title}
                            </span>
                            
                        </div>
                        <div
                            className='flex flex-col items-start'
                            
                        >   
                        {
                            showDes && 

                            <div className="w-full wrap-break-word">
                                {video?.description}
                            
                            </div>
                        }
                            <button onClick={() => setShowDes(
                                (prev) => !prev
                            )} className='text-gray-400 text-sm'>{!showDes? <div>show more</div> : <div>show less</div> }</button>
                        </div>
                    </div>
                </div>
            )}
            <div
                ref={videoRef}
                className=' w-full  h-14'
            >

            </div>
        </div>
    );
}

export default Home;