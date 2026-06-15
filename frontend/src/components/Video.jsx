import React, { forwardRef, useRef, useState, useEffect } from 'react';

const  Video =  forwardRef(({src, className, autoPlay = false}, ref) => {

    const videoRef = useRef(null)

    const [progress, setProgress] = useState(0)
    const [seeking, setSeeking] = useState(false)

    useEffect(() => {
        let animationFrame
        
        const updateProgress = () => {
            const video = videoRef.current
            

            if(video?.duration && !seeking) {

                setProgress(
                    (video.currentTime/video.duration) * 100
                )
            }
            animationFrame = requestAnimationFrame(updateProgress)
        }
        animationFrame = requestAnimationFrame(updateProgress)

        return () => cancelAnimationFrame(animationFrame)
    }, [seeking])
    
    return (
        <div className={`relative h-full w-full aspect-9/16 ${className}`}>

            <video 
            src={src}
            className='h-full w-full '
            ref={
                (el) => {
                    videoRef.current = el
                    if(typeof ref === "function") {
                        ref(el)
                    } else {

                        ref.current =  el
                    }
                }
            }
            loop
            autoPlay={autoPlay}
            >

            </video>
            <input 
                type="range" 
                min="0"
                max="100"
                className='absolute bottom-0 left-0 w-full h-1 appearance-none z-10'
                style={{
                    background: `linear-gradient(
                        to right,
                        white 0%,
                        white ${progress}%,
                        rgba(255, 255, 255, 0.3) ${progress}%,
                        rgba(255, 255, 255, 0.3) 100%
                    )`
                }}
                value={progress}
                onChange={(e) => {
                    setProgress(Number(e.target.value))
                }}
                onPointerDown={
                    () => setSeeking(true)
                }
                onPointerUp={
                    (e) => {
                        setSeeking(false)
                        videoRef.current.currentTime = (e.target.value/100)* videoRef.current.duration
                    }
                }
            />
        </div>
    );
})

export default Video;
