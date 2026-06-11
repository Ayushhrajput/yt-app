import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSetting } from '../context/SettingContext';

function Navbar({className}) {
    const {darkTheme} = useTheme()
    const {setting, setSetting} = useSetting()
    const handleSetting = () => {
        setSetting(
            (prev) => !prev
        )
    }
    
    return (
        
            <div className={className }>
                <div className={`flex justify-between items-center h-full ${darkTheme? "bg-gray-900 text-white border-gray-800 ": "bg-white border-gray-100"} border-b px-4`}>
                    <h1 className='font-["pacifico"] text-lg '>Twitchflix</h1>
                    <div className='cursor-pointer' onClick={handleSetting}>
                        <span class="material-symbols-outlined">
                        more_vert
                        </span>
                    </div>
                </div>
            </div>
    );
}

export default Navbar;