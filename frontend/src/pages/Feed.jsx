import React, {useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllVideos } from '../services/videoService.js';

function Shorts(props) {
    const [videos, setVideos] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [fetch, setFetch] = useState(false)

    const videoRefs = useRef([])
    const lastvideoRef = useRef(null)

    



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
                    const video = entry.target.querySelector("video")
                    
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
        <div className='h-screen overflow-y-scroll scrollbar-hide snap-y snap-mandatory'>
            {
                videos.map((video, index) => (
                    <div
                        key={video._id}
                        className='snap-start h-screen bg-black'
                        
                    >
                        <video src={video.videoFile}
                            className='h-full w-full aspect-9/16'
                            ref={
                                (el) => {
                                    videoRefs.current[index] = el
                                    index === videos.length - 1? lastvideoRef.current: null 
                                } 
                            }
                        ></video>
                    </div>
                ))
            }
        </div>
    );
}

export default Shorts;