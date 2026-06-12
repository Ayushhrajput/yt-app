import React, { useState } from 'react';
import { publishVideo } from '../services/videoService';
import { useTheme } from '../context/ThemeContext';

function PostVideo(props) {

    const {darkTheme} = useTheme()

    const [formData, setFromData] = useState({
        title: "",
        description: ""
    })
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const [status, setStatus] = useState("")
    const handleChange = (e) => {
        setFromData(
            {
                ...formData,
                [e.target.name]: e.target.value
            }
        )
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData()

        data.append("title", formData.title)
        data.append("thumbnail", thumbnail)
        data.append("videoFile", videoFile)
        data.append("description", formData.description)

        try {
            const response = await publishVideo(data)
            console.log(response)
            setStatus(response.message)
        } catch (e) {
            setStatus(e.message)
            throw new Error(e)
        }
    }
    return (
        <div className='py-14'>
            {
                !videoFile &&
                <div className='w-full h-screen flex justify-center items-center'>
                    <form 
                        className='flex flex-col gap-4'
                        action=""
                    >  
                        <label 
                            className={`${darkTheme? "text-white": "text-black"} w-20 md:w-25 md:h-25 h-20 shadow-lg rounded-full backdrop-blur flex justify-center items-center `}
                            htmlFor="videoFile"
                        >
                            <i class="fa-solid fa-file-arrow-up text-2xl md:text-4xl"></i>
                        </label>
                        <input 
                            id='videoFile'
                            onChange={(e) => (setVideoFile(e.target.files[0]))}
                            type="file" 
                            className='hidden'
                        />
                        <button className='text-blue-500' type="submit">Upload</button>
                    </form>
                </div>
            }
            {
                videoFile && (
                    <form 
                        onSubmit={handleSubmit}
                        action=""
                    >
                        <input 
                            onChange={(e) => (setThumbnail(e.target.files[0]))}
                            type="file" 
                        />
                        <input 
                            value={formData.title}
                            placeholder='title'
                            onChange={handleChange}
                            type="text" 
                        />
                        <input 
                            value={formData.thumbnail}
                            placeholder='Thumbnail'
                            onChange={handleChange}
                            type="text" 
                        />
                        {
                            status && <span>{status}</span>
                        }
                        {videoFile.name}
                        <button
                            type="submit"
                        >
                            Upload
                        </button>
                        
                    </form>
                )
            }
            
            
        </div>
    );
}

export default PostVideo;