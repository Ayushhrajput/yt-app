import React, { useRef, useState } from 'react';
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
    
    const videoRef = useRef(null)

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
            setPostStatus(true)
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
            
            setStatus(response.message)
            
        } catch (e) {
            setStatus(e.message)
            
            setPostStatus(false)
        } 
    }
    console.log(status)
    return (
        <div className=' w-full '>
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
                                setStatus("")
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
                        className={` ${darkTheme? "text-white": ""} font-bold w-full  h-screen flex flex-col md:items-center md:flex-row `}
                    >
                            
                            <form 
                                onSubmit={handleSubmit}
                                action=""
                                className="flex flex-col h-full px-4 py-2   w-full "
                            >   
                                <div className={`flex justify-between items-center gap-2 ${darkTheme? "text-white border-white/20 ": "text-black bg-white/10 border-black/20"} w-full font-normal border-b mb-4 pt-4`}>
                                    
                                    <input 
                                        id='title'
                                        name='title'
                                        placeholder='Title'
                                        value={formData.title}
                                        className='w-full outline-none '
                                        onChange={handleChange}
                                        type="text" 
                                        maxLength={100}
                                    />
                                    <span className='text-gray-400 text-sm'>{formData.title.length}/100</span>
                                </div>
                                <div className={`flex flex-col justify-between items-end gap-2 ${darkTheme? "text-white border-white/20  from-black/10 to-black/40": "text-black  border-black/20 from-gray-100 to-white "} bg-gradient-to-b w-full outline-none border rounded-2xl font-normal h-40 mb-4 px-2 `}>
                                    
                                    <textarea 
                                        id='description'
                                        name='description'
                                        placeholder='Description'
                                        value={formData.description}
                                        className='w-full h-full outline-none '
                                        onChange={handleChange}
                                        type="text" 
                                        maxLength={100}
                                    />
                                    <span className='text-gray-400 text-sm'>{formData.description.length}/100</span>
                                </div>
                                
                                <div className='flex flex-col  w-full  items-center '>
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
                                        <div className='w-full '>

                                            <label htmlFor="thumbnail" className='mb-2'>Thumbnail</label>
                                            <div className={`flex flex-col  w-full ${darkTheme? "text-white border-white/20 bg-black/60": "text-black bg-white/10 border-black/20"} border rounded-2xl overflow-hidden items-center justify-center `}>

                                                <div className={` flex flex-col items-center h-60 w-full`}>
                                                    <div
                                                        className={`bg-center  bg-contain bg-no-repeat h-full w-full aspect-9/16 flex justify-center items-center `}
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
                                            onClick={() => (
                                                setStatus("")
                                            )}
                                            >
                                            Upload
                                        </button>
                                    }
                                    {postStatus && 
                                        <div className='text-blue-500 w-max pt-4'>posting</div>
                                    }
                                </div>
                                {status && <div className='font-normal'>{status}</div>}
                                
                            </form>
                        <div className="w-full flex flex-col gap-2 px-4 py-2 pb-16" >
                            <div className=''>
                                Video Preview
                            </div>
                            <div className={`flex flex-col  w-full ${darkTheme? "text-white border-white/20 bg-black/60": "text-black bg-white/10 border-black/20"} border rounded-2xl overflow-hidden items-center justify-center `}>
                                <div 
                                    onClick={
                                        () => {
                                            
                                        }
                                    }
                                    className='flex flex-col  h-60 md:h-full w-full items-center'
                                >
                                    <video 
                                        ref={videoRef}
                                        className={`aspect-9/16 w-full h-full md:w-60  ${darkTheme? "text-white  bg-black/20": "text-black bg-white/10 "}`}
                                        src={videoPreview}
                                    >
                                    </video>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                )
            }
            
            
        </div>
    );
}

export default PostVideo;