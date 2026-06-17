import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVideoById } from '../services/videoService';
import { useSetting } from '../context/SettingContext';
import { useTheme } from '../context/ThemeContext';
import Video from '../components/Video.jsx';
import { toggleVideoPlay } from '../utils/togglePlay.js';

function VideoPage(props) {
    const {videoId} = useParams({})
    const [video, setVideo] = useState({})
    const [showDes, setShowDes] = useState(false)
    const {darkTheme} = useTheme()
    const videoRef = useRef(null)
    
    
    
    useEffect(() => {
        const getVideo = async() => {
            const response = await getVideoById(videoId)
            setVideo(response.data)
            
        }
        getVideo()
    }, [videoId]) 

    
    
    return (
        <div className="min-h-screen overflow-hidden flex justify-center"  >
            <div className='h-screen w-max flex justify-center bg-black relative'>
                
                <Video 
                    src={video.videoFile}
                    ref={videoRef}
                    autoPlay={true}
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
                <button onClick={() => toggleVideoPlay(videoRef)} className='h-full  aspect-9/16  absolute left-1/2 -translate-x-1/2  bottom-0 '></button>
            </div>
        </div>
    );
}

export default VideoPage;