import {createContext, useContext, useState } from "react";

const VideoContext = createContext()

export const VideoProvider = ({children}) => {

    const [hasVideos, setHasVideos] = useState(false)
    return (
        <VideoContext.Provider value={{hasVideos, setHasVideos}}>
            {children}
        </VideoContext.Provider>
    )
}

export const useVideo = () => {
    return useContext(VideoContext)
}
