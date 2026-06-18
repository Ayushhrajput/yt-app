import React, {useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllVideos } from '../services/videoService.js';
import Video from '../components/Video.jsx';
import { toggleVideoPlay } from '../utils/togglePlay.js';
import LoaderBar from '../components/Loaders/LoaderBar.jsx';

function Shorts(props) {
    const [videos, setVideos] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [fetch, setFetch] = useState(false)
    const [showDes, setShowDes] = useState(false)
    
    const videoRefs = useRef([])
    const lastvideoRef = useRef(null)
    const currVideoRef = useRef(null)

    
    


    useEffect(() => {
        
        const fetchAllVideos = async() => {
            
            if(fetch) return
          
            setFetch(true)

            try {
                const response = await getAllVideos(
                    {
                        page,
                        limit: 5
                    }
                )
                const newVideos = response.data.videos
                setVideos((prev) => [...prev, ...newVideos])
               
                if(newVideos.length < 5) {
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
                threshold: 0.5
            }
        )

        if(lastvideoRef.current) {
            observer.observe(lastvideoRef.current)
        }

        return () => observer.disconnect()
    }, [hasMore, fetch, videos])
        
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target
                    
                    if(entry.isIntersecting) {
                        video.play()
                    } else {
                        video.pause()
                        video.currentTime = 0
                    }
                })
                
            }, {
                threshold: 0.5
            }
            
        )
        videoRefs.current.forEach(ref => {
            if(ref) observer.observe(ref)
        });

        return () => observer.disconnect()
    }, [videos])
    
    

    return (
        <div className='min-h-screen overflow-hidden w-full flex flex-col items-center  overflow-y-scroll scrollbar-hide snap-y snap-mandatory'>
            {
                videos.map((video, index) => (
                    <div
                    key={video._id}
                    className='snap-start h-screen max-w-full  flex justify-center bg-black relative'
                    
                    >   <Video 
                    src={video.videoFile}
                    ref={
                                (el) => {
                                    videoRefs.current[index] = el
                                    if(index === videos.length - 1) lastvideoRef.current = el
                                    currVideoRef.current = el
                                } 
                            }
                            className=""
                            
                            
                            />
                        <div className=' absolute bottom-0  left-0 px-4 z-10'>
                            <div className='flex items-center text-white gap-2 py-2 '>
                                <div className='w-10 h-10 border border-blue-500 rounded-full'>
                                <img src={video?.owner?.avatar} alt={video.title} className='w-full h-full object-cover rounded-full p-0.5' />
                                </div>
                                <div className=''>{video?.owner?.username}</div>
                            </div>
                            <div className='flex flex-col  text-white gap-2 pb-4 '>
                                <h1 className='font-semibold'>{video?.title}</h1>
                                
                                
                                <div
                                    className='flex flex-col items-start'
                                    
                                    >   
                                {   
                                    showDes && 
                                    
                                    <div className="w-60  wrap-break-word">
                                        {video?.description}
                                    
                                    </div>
                                }
                                    <button onClick={() => setShowDes(
                                        (prev) => !prev
                                    )} className='text-gray-200 text-sm '>{!showDes? <div>show more</div> : <div>show less</div> }</button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => toggleVideoPlay(currVideoRef)} className='h-full  aspect-9/16  absolute left-1/2 -translate-x-1/2  bottom-0 '></button>
                    </div>
                    
                ))
            }
            {fetch && (
                <div className='h-full'>
                    <LoaderBar className="h-10"/>
                </div>
            )}
        </div>
    );
}

export default Shorts;