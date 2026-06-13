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
    const [error, setError] = useState("")
    const [thumbnailPreview, setThumbnailPreview] = useState("")
    const [videoPreview, setVideoPreview] = useState("")
    const [postStatus, setPostStatus] = useState(false)
    
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
        setPostStatus(true)
        try {
            const response = await publishVideo(data)
            console.log(response)
            setStatus(response.message)
            setError("")
            setVideoFile(null)
            setThumbnail(null)
            setFromData({
                title: "",
                description: ""
            })
            setPostStatus(false)
            
            
        } catch (e) {
            setStatus(e.message)
            throw new Error(e)
        } finally {
            setPostStatus(false)
        }
    }
    console.log(postStatus)
    return (
        <div className='h-screen w-full '>
            {
                !videoFile &&
                <div className='w-full h-screen flex justify-center items-center'>
                    <form 
                        className='flex flex-col items-center gap-4'
                        action=""
                    >  
                        <label 
                            className={`${darkTheme? "text-white border-black/20 bg-black/10": "text-black bg-white/10 border-black/10"} border w-20 md:w-25 md:h-25 h-20 shadow-lg rounded-full backdrop-blur flex justify-center items-center `}
                            htmlFor="videoFile"
                        >
                            <i class="fa-solid fa-file-arrow-up text-2xl md:text-4xl"></i>
                        </label>
                        <input 
                            id='videoFile'
                            accept='video/*'
                            onChange={(e) => {
                                const file = e.target.files[0]
                                setVideoFile(file)
                                setVideoPreview(URL.createObjectURL(file))
                            }
                            }
                            type="file" 
                            className='hidden'
                        />
                        
                        <button 
                            onClick={(e) => {
                                e.preventDefault()
                                !videoFile && setError("Select a video to post")
                            }}
                            className='text-blue-500' type="submit"
                        >
                            Upload
                        </button>
                    </form>
                    <div className={`fixed top-1/4 ${darkTheme? "text-white": ""}`}>
                        {error}
                    </div>
                    {status && 
                    <span className={`fixed top-1/4 ${darkTheme? "text-white": ""}`}>
                        {status}
                    </span>
                    }
                </div>
            }
            {
                videoFile && (
                    <div 
                        className={` ${darkTheme? "text-white": ""} w-full h-screen pt-14 flex flex-col md:flex-row `}
                    >
                            
                            <form 
                                onSubmit={handleSubmit}
                                action=""
                                className={`flex flex-col px-4 py-2 justify-around h-max w-full ${darkTheme? "border-white/20": "border-black/20"} md:border-r`}
                            >   
                                <div className='flex justify-between '>
                                    <label htmlFor="title" className='mb-2'>Title</label>
                                    <span>{formData.title.length}/100</span>
                                </div>
                                <input 
                                    id='title'
                                    name='title'
                                    value={formData.title}
                                    className={`${darkTheme? "text-white border-white/20 ": "text-black bg-white/10 border-black/20"} w-full outline-none border-b mb-4 px-2`}
                                    onChange={handleChange}
                                    type="text" 
                                    maxLength={100}
                                />
                                <div className='flex justify-between '>
                                    <label htmlFor="description" className='mb-2'>Description</label>
                                    <span>{formData.description.length}/100</span>
                                </div>
                                <textarea 
                                    id='description'
                                    name='description'
                                    value={formData.description}
                                    className={`${darkTheme? "text-white border-white/20 bg-black/20": "text-black bg-gray-100 border-black/20"} w-full outline-none border rounded-lg h-40 mb-4 px-2`}
                                    onChange={handleChange}
                                    type="text" 
                                    maxLength={100}
                                />
                                
                                <div className='flex flex-col  w-full items-center '>
                                    {
                                        !thumbnail &&
                                        <div className='w-full flex flex-col'>

                                            <div className='flex flex-col '>
                                                <label htmlFor="thumbnail">Thumbnail</label>
                                                <div className='flex justify-center'>
                                                    <label 
                                                        className={`${darkTheme? "text-white border-black/20 bg-black/10": "text-black bg-white/10 border-black/10"} border w-20  h-20 shadow-lg rounded-full backdrop-blur flex justify-center items-center `}
                                                        htmlFor="thumbnail"
                                                    >
                                                        <i class="fa-solid fa-file-arrow-up text-2xl md:text-4xl"></i>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {thumbnail &&
                                        <div className='w-full flex flex-col'>

                                            <label htmlFor="thumbnail" className='mb-2'>Thumbnail</label>
                                            <div className={` flex justify-center `}>
                                                <div
                                                    className={`bg-center  bg-contain bg-no-repeat w-40 aspect-9/16 flex justify-center items-center ${darkTheme? "text-white border-white/20 bg-black/20": "text-black bg-white/10 border-black/20"} border rounded-lg`}
                                                    style={{
                                                        backgroundImage: `url(${thumbnailPreview})`
                                                    }}
                                                >
                                                    
                                                    <label 
                                                        className={`${darkTheme? "text-white border-black/20 ": "text-black  border-black/10"} border w-20  h-20 shadow-lg rounded-full backdrop-blur flex justify-center items-center `}
                                                        htmlFor="thumbnail"
                                                    >
                                                        <i class="fa-solid fa-file-arrow-up text-2xl md:text-4xl"></i>
                                                    </label>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    } 

                                    <input 
                                        id='thumbnail'
                                        className='hidden'
                                        accept='image/*'
                                        onChange={(e) => {
                                            const file = e.target.files[0]

                                            setThumbnail(file)
                                            if(file) {

                                                setThumbnailPreview(URL.createObjectURL(file))
                                            }
                                        }
                                        }
                                        type="file" 
                                    />
                                    {!postStatus && 
                                        
                                        <button
                                            className='text-blue-500 w-max pt-4' type="submit"
                                            
                                            >
                                            Upload
                                        </button>
                                    }
                                    {postStatus && 
                                        <div className='text-blue-500 w-max pt-4'>posting</div>
                                    }
                                </div>
                                    
                                
                            </form>
                        <div className='w-full flex flex-col gap-2 px-4 py-2 pb-16 '>
                            <div className=''>
                                Video Preview
                            </div>
                            <div className=' flex flex-col items-center justify-center '>
                                <div className=''>
                                    <video 
                                        controls
                                        className={`aspect-9/16 w-40 md:w-60  ${darkTheme? "text-white border-white/20 bg-black/20": "text-black bg-white/10 border-black/20"} border rounded-lg`}
                                        src={videoPreview}
                                    >
                                    </video>
                                </div>
                            </div>
                            <span className='w-full '>
                            {videoFile.name}
                            </span>
                        </div>
                    </div>

                )
            }
            
            
        </div>
    );
}

export default PostVideo;