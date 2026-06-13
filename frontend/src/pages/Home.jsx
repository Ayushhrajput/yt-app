import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {getUserChannel, logout} from "../services/authservice.js"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { getAllVideos } from '../services/videoService.js';
import { useSetting } from '../context/SettingContext.jsx';

function Home(props) {
    const [videos, setVideos] = useState([])
    
    const navigate = useNavigate()
    useEffect(() => {
        const fetchAllVideos = async() => {
            try {
                const response = await getAllVideos()
                setVideos(response.data.videos)
                

            } catch (e) {
                throw new Error(e.message)
            }
        }
        fetchAllVideos()
    }, [])
    
       
    return (
        <div className='pt-14 w-full min-h-screen'>
            {videos.map((video) => 
                <div
                    key={video._id}
                >
                    {video.title}
                    <img src={video.thumbnail} alt={video.title} onClick={() => {
                        navigate(`/home/video/${video._id}`)
                        
                    }}/>
                </div>
            )}
        </div>
    );
}

export default Home;