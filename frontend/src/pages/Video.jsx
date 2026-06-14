import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVideoById } from '../services/videoService';
import { useSetting } from '../context/SettingContext';
import { useTheme } from '../context/ThemeContext';


function Video(props) {
    const {videoId} = useParams({})
    const [video, setVideo] = useState({})
    const [showDes, setShowDes] = useState(false)
    const {darkTheme} = useTheme()
    const videoRef = useRef(null)
    
    const toggleVideoPlay = () => {
        if(videoRef.current.paused) {
            videoRef.current.play()
        } else {
            videoRef.current.pause()
        }
    }
    
    useEffect(() => {
        const getVideo = async() => {
            const response = await getVideoById(videoId)
            setVideo(response.data)
            
        }
        getVideo()
    }, [videoId]) 

    
    
    return (
        <div className={`min-h-screen flex justify-center items-center ${darkTheme? "bg-black/90": "bg-white"} `}>
            <div className='h-screen '>
                <video  
                    src={video.videoFile}
                    ref={videoRef}
                    loop
                    autoPlay
                    className="h-full w-full  max-w-sm aspect-9/16 bg-black"
                >
                    
                    
                </video>
                
                <div className=' fixed  bottom-0 pb-14 md:pb-0 px-4 '>
                    <div className='flex items-center text-white gap-2 py-2 '>
                        <img src={video?.owner?.avatar} alt="" className='rounded-full border border-blue-500 object-cover w-10 h-10'/>
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
                            )} className='text-gray-200 text-sm'>{!showDes? <div>show more</div> : <div>show less</div> }</button>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={toggleVideoPlay} className='h-40  aspect-9/16 fixed '></button>
        </div>
    );
}

export default Video;