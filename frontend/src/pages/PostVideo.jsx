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

    const [thumbnailPreview, setThumbnailPreview] = useState("")
    const [videoPreview, setVideoPreview] = useState("")
    const [postStatus, setPostStatus] = useState(false)
    
    const [showError, setShowError] = useState(false)

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
        
        if([formData.title, formData.description].some((data) => (
            data === ""
        ))) {
            setPostStatus(false)
            setShowError(true)
            return
        }
        if(postStatus) return
        setPostStatus(true)

        data.append("title", formData.title)
        data.append("thumbnail", thumbnail)
        data.append("videoFile", videoFile)
        data.append("description", formData.description)
        try {
            const response = await publishVideo(data)
            
            
        
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

    const generateThumbnail = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video')
            video.src = URL.createObjectURL(file)
            

            video.addEventListener("loadeddata", () => {
                video.currentTime =Math.min(1, video.duration/2)
            })

            video.addEventListener('seeked', () => {
                const canvas = document.createElement('canvas')
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                const ctx = canvas.getContext('2d')
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

                resolve(canvas.toDataURL('image/jpeg'))
                
            })
        })
    }
    

    
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
                            onChange={async (e) => {
                                const file = e.target.files[0]
                                setVideoFile(file)
                                setVideoPreview(URL.createObjectURL(file))

                                const thumbnailUrl = await generateThumbnail(file)
                                setThumbnailPreview(thumbnailUrl)
                            }
                            }
                            type="file" 
                            className='hidden'
                        />
                        {status && <div className={`w-max absolute top-1/4 left-1/2 -translate-x-1/2 ${darkTheme? "bg-white": "bg-blue-500/40"}  rounded-full px-4 py-2`}>{status}</div> }
                    </form>
                    
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
                                <button className={`absolute top-2 right-2 py-1 px-4 rounded-2xl cursor-pointer ${darkTheme? "bg-white/20": "bg-black/40 text-white"} `}
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
                        className={` ${darkTheme? "text-white": ""} w-full  h-screen flex justify-center `}
                    >
                            {showError && 
                                <div className='absolute top-1/2 px-4 py-2 flex gap-4 w-max text-white bg-black rounded-full '> 
                                    <div className=' '>All fields are required</div>
                                    <button className='' onClick={() => setShowError(false)}><i class="fa-solid fa-xmark"></i></button>
                                </div>
                                
                            }
                            <form 
                                onSubmit={handleSubmit}
                                action=""
                                className={`flex flex-col  w-full h-auto max-w-full  gap-2 items-center m-4 px-4 py-2  ${darkTheme? " shadow-[inset_0px_8px_16px_rgba(255,255,255,0.1)]": "shadow-[inset_0px_8px_16px_rgba(0,0,0,0.1)]"}    rounded-2xl max-w-md `}
                            >   
                                <div className='flex w-full items-start gap-2'>
                                    <div className={`flex w-full ${darkTheme? `border-black/40 `: `border-black/10 `} border-b  h-full py-2  items-center gap-2`}>
                            
                                        <div className='w-max '>

                                            <div className={`flex flex-col  h-40 w-max ${darkTheme? "text-white border-black/20 bg-black/20": "text-black bg-white/10 border-gray-100"} border  rounded-2xl overflow-hidden items-center justify-center `}>

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
                                        
                                        <div className={`flex flex-col w-full h-full justify-between items-end  gap-2 ${darkTheme? "text-white   ": "text-black  "} w-full  font-normal  `}>
                                            
                                            <textarea 
                                            id='title'
                                            name='title'
                                            placeholder='Caption'
                                            value={formData.title}
                                            className='w-full h-full outline-none '
                                            onChange={
                                                (e) => {
                                                    handleChange(e)
                                                    
                                                }
                                            }
                                            type="text" 
                                            maxLength={100}
                                        />
                                            <span className='text-gray-400 text-sm'>{formData.title.length}/100</span>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div 
                                    className={`flex flex-col justify-between items-end gap-2 ${darkTheme? `text-white  from-black/10 to-black/40 `: `text-black   bg-gray-100 `}  bg-gradient-to-b w-full outline-none  rounded-2xl font-normal h-40 px-2 `}
                                >
                                    
                                    <textarea 
                                        id='description'
                                        name='description'
                                        placeholder='Description'
                                        value={formData.description}
                                        className='w-full h-full outline-none '
                                        onChange={
                                            (e) => {
                                                handleChange(e)
                                                
                                            }
                                        }
                                        type="text" 
                                        maxLength={400}
                                    />
                                    <span className='text-gray-400 text-sm'>{formData.description.length}/400</span>
                                </div>
                                
                                
                                <div className='flex-1 flex items-center justify-center w-full '>

                                    <button
                                        className={` w-max  overflow-hidden  flex items-center justify-center   text-blue-500 border-b cursor-pointer  `} 
                                        type="submit"
                                        onClick={() => {
                                            
                                        }}
                                        > 
                                            <div className='relative  h-10 w-15'>

                                            <div className={`absolute py-2 inset-0 ${postStatus? " -translate-y-full ": "translate-y-0"} transition-all duration-100`} >Upload</div> 

                                            <div className={`absolute inset-0 py-2 ${!postStatus? "translate-y-full ": "translate-y-0"} transition-all duration-100`}>Posting</div>
                                            </div>
                                        
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