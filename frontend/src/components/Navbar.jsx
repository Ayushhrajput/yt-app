import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Navbar({className}) {
    const {darkTheme} = useTheme()
    return (
        
            <div className={className }>
                <div className={`flex justify-between items-center h-full ${darkTheme? "bg-gray-900 text-white border-gray-800 ": "bg-white border-gray-100"} border-b px-4`}>
                    <h1 className='font-["pacifico"] text-lg '>Twitchflix</h1>
                    
                </div>
            </div>
    );
}

export default Navbar;