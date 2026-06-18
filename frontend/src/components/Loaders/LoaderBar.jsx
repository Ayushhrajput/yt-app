import React from 'react';
import { useTheme } from '../../context/ThemeContext';

function LoaderBar({className}) {

    const {darkTheme} = useTheme()

    return (
        <div className={`${className}  flex justify-center items-center `}>
            <div className='bars'>
                <div 
                    style={{"--i": 1}} 
                    className={`bar ${darkTheme? "bg-white/90": "bg-black/90"}  w-0.5 h-2 rounded-2xl absolute`}>
                </div>
                <div 
                    style={{"--i": 2}}
                    className={`bar ${darkTheme? "bg-white/90": "bg-black/90"}  w-0.5 h-2 rounded-2xl absolute`}>
                </div>
                <div 
                    style={{"--i": 3}}
                    className={`bar ${darkTheme? "bg-white/90": "bg-black/90"}  w-0.5 h-2 rounded-2xl absolute`}>
                </div>
                <div 
                    style={{"--i": 4}}
                    className={`bar ${darkTheme? "bg-white/90": "bg-black/90"}  w-0.5 h-2 rounded-2xl absolute`}>
                </div>
                <div 
                    style={{"--i": 5}}
                    className={`bar ${darkTheme? "bg-white/90": "bg-black/90"}  w-0.5 h-2 rounded-2xl absolute`}>
                </div>
                <div 
                    style={{"--i": 6}}
                    className={`bar ${darkTheme? "bg-white/90": "bg-black/90"}  w-0.5 h-2 rounded-2xl absolute`}>
                </div>
                <div 
                    style={{"--i": 7}}
                    className={`bar ${darkTheme? "bg-white/90": "bg-black/90"}  w-0.5 h-2 rounded-2xl absolute`}>
                </div>
                <div 
                    style={{"--i": 8}}
                    className={`bar ${darkTheme? "bg-white/90": "bg-black/90"}  w-0.5 h-2 rounded-2xl absolute`}>
                </div>
                <div 
                    style={{"--i": 9}}
                    className={`bar ${darkTheme? "bg-white/90": "bg-black/90"}  w-0.5 h-2 rounded-2xl absolute`}>
                </div>
                <div 
                    style={{"--i": 10}}
                    className={`bar ${darkTheme? "bg-white/90": "bg-black/90"}  w-0.5 h-2 rounded-2xl absolute`}>
                </div>
                
            </div>
        </div>
    );
}

export default LoaderBar;