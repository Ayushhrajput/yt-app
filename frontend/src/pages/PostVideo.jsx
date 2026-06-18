import React, { useRef, useState } from 'react';
import { publishVideo } from '../services/videoService';
import { useTheme } from '../context/ThemeContext';
import { toggleVideoPlay } from '../utils/togglePlay.js';

function PostVideo(props) {

    const {darkTheme} = useTheme()
    
    const [formData, setFromData] = useState({
        title: "",
        description: ""
    })

    const [canUpload, setCanUpload] = useState(false)

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
        setPostStatus(true)
        data.append("title", formData.title)
        data.append("thumbnail", thumbnail)
        data.append("videoFile", videoFile)
        data.append("description", formData.description)
        try {
            const response = await publishVideo(data)
            
            
            setStatus(response.message)
            setError("")
            setVideoFile(null)
            setCanUpload(false)
            setThumbnail(null)
            setFromData({
                title: "",
                description: ""
            })
            setPostStatus(true)
            
            setStatus(response.message)
            
        } catch (e) {
            setStatus(e.message)
            
            setPostStatus(false)
        } finally {
            setPostStatus(false)
        }
    }
    console.log(videoFile)
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
                        
                    </form>
                    {status && 
                    <span className={`fixed top-1/4 ${darkTheme? "text-white": ""}`}>
                        {status}
                    </span>
                    }
                </div>
            }   
            {
                videoFile && !canUpload && 
                    <div className='h-screen flex items-center justify-center p-4'>
                        <div className={`flex flex-col h-full w-max  ${darkTheme? "text-white border-black/20 bg-black/60": "text-black bg-white/10 border-black/20"} border rounded-2xl overflow-hidden items-center justify-center `}>
                            <div 
                                onClick={
                                    () => {
                                        toggleVideoPlay(videoRef)
                                    }
                                }
                                className='flex flex-col relative  h-full w-full  aspect-9/16 items-center'
                            >
                                <video 
                                    ref={videoRef}
                                    className={` w-full h-full  `} 
                                    src={videoPreview}
                                >
                                </video>
                                <button className={`absolute top-2 right-2 py-2 px-4 rounded-2xl ${darkTheme? "bg-white/20": "bg-black/40 text-white"} `}
                                    onClick={() => setCanUpload(true)}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                        
            }
            {
                canUpload && (
                    <div 
                        className={` ${darkTheme? "text-white": ""} w-full  h-screen flex justify-center`}
                    >
                            
                            <form 
                                onSubmit={handleSubmit}
                                action=""
                                className={`flex flex-col gap-2 items-center m-4 px-4 py-2  ${darkTheme? " from-black/20 to-black ": "from-gray-100 to-gray-100  "}   bg-gradient-to-b rounded-2xl max-w-md `}
                            >   
                                <div className='flex items-start gap-2'>
                                    <div className={`flex ${darkTheme? "border-black/20": "border-black/10"} border-b  h-full py-2  items-center gap-2`}>
                                        {
                                            !thumbnail &&
                                            <div className='w-max flex flex-col'>
 
                                                <div className={`flex items-center justify-center h-40  aspect-9/16  rounded-2xl ${darkTheme? "text-white border-black/20 bg-black/20": "text-black bg-white/10 border-white"} border `}>
                                                    <label 
                                                        className={`${darkTheme? "text-white  ": "text-black  "}  w-10 h-10  rounded-full backdrop-blur flex justify-center items-center `}
                                                        htmlFor="thumbnail"
                                                    >
                                                        <i class="fa-solid fa-file-arrow-up  "></i>
                                                    </label>
                                                </div>
                                                
                                            </div>
                                        }
                                        {thumbnail &&
                                            <div className=' '>

                                                <div className={`flex flex-col  h-40 w-max ${darkTheme? "text-white border-black/20 bg-black/20": "text-black bg-white/10 border-white"} border  rounded-2xl overflow-hidden items-center justify-center `}>

                                                    <div className={` flex flex-col items-center h-full w-full `}>
                                                        <div
                                                            className="bg-center  bg-contain bg-no-repeat h-full w-full aspect-9/16 flex justify-center items-center "
                                                            style={{
                                                                backgroundImage: `url(${thumbnailPreview})`
                                                            }}
                                                        >
                                                            
                                                            <label 
                                                                className={`${darkTheme? "text-white  ": "text-black  "} border-white/20 border w-10  h-10  rounded-full backdrop-blur flex justify-center items-center `}
                                                                htmlFor="thumbnail"
                                                            >
                                                                <i class="fa-solid fa-file-arrow-up "></i>
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
                                        
                                        <div className={`flex w-full h-full justify-between items-end  gap-2 ${darkTheme? "text-white   ": "text-black  "} w-full  font-normal  `}>
                                            
                                            <textarea 
                                            id='title'
                                            name='title'
                                            placeholder='Caption'
                                            value={formData.title}
                                            className='w-full h-full outline-none '
                                            onChange={handleChange}
                                            type="text" 
                                            maxLength={100}
                                        />
                                            <span className='text-gray-400 text-sm'>{formData.title.length}/100</span>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className={`flex flex-col justify-between items-end gap-2 ${darkTheme? "text-white border-black/40  from-black/10 to-black/40": "text-black  border-white from-gray-100 to-white "} shadow-sm bg-gradient-to-b w-full outline-none border rounded-2xl font-normal h-40 px-2 `}>
                                    
                                    <textarea 
                                        id='description'
                                        name='description'
                                        placeholder='Description'
                                        value={formData.description}
                                        className='w-full h-full outline-none '
                                        onChange={handleChange}
                                        type="text" 
                                        maxLength={400}
                                    />
                                    <span className='text-gray-400 text-sm'>{formData.description.length}/400</span>
                                </div>
                                {status && <div className='font-normal'>{status}</div>}
                                
                                <div className='flex-1 flex items-center justify-center w-full '>

                                <button
                                    className={` w-max py-2 px-4 rounded-2xl ${darkTheme? "bg-white/20": "bg-blue-500 text-white"} cursor-pointer  flex items-center justify-center`} type="submit"
                                    onClick={() => {
                                        setStatus("")
                                        
                                    }}
                                    >
                                        {!postStatus? <div>Upload</div> : <div>Posting</div>}
                                    
                                </button>
                                </div>
                                
                                
                                
                            </form>
                        
                    </div>

                )
            }
            
            
        </div>
    );
}

export default PostVideo;