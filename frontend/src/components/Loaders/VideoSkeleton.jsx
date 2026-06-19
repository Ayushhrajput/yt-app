import React from 'react';
import { useTheme } from '../../context/ThemeContext';

function VideoSkeleton(props) {

    const {darkTheme} = useTheme()

    return (
        <div className='relative '>
            <div className='w-full absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-1'></div>
            
                <div className='w-full flex  flex-col items-center '>
                    <div className={`w-full  h-screen flex justify-center ${darkTheme? "bg-black":"bg-white"} `}>
                        <div className='h-full w-auto max-w-full  max-h-screen  aspect-9/16'>

                            <div className={`${darkTheme? "bg-white/20": "bg-black/20"}    h-full object-contain  relative`}>
                                <div className='absolute top-0 flex items-center w-full gap-2 py-2 px-4 text-white'>
                                    
                                    <div className={`h-10 min-w-10  rounded-full ${darkTheme? "bg-white/20": "bg-black/20"} `}></div>
                                    <span className={`h-4 w-1/2  ${darkTheme? "bg-white/20": "bg-black/20"} rounded-sm`}></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-full gap-4 px-4 py-2'>
                        <div className='w-full flex gap-2'>
                            <div className={`${darkTheme? "bg-white/20": "bg-black/20"} rounded-sm w-1/4 py-2 `}>
                            </div>
                            <span className={`px-2 w-1/2 ${darkTheme? "bg-white/20": "bg-black/20"} rounded-sm`}>
                            </span>
                            
                        </div>
                        <div className={`w-1/6 py-2 ${darkTheme? "bg-white/20": "bg-black/20"} rounded-sm`}></div>
                    </div>
                </div>
            

        </div>
    );
}

export default VideoSkeleton;