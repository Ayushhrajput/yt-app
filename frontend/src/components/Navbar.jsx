import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSetting } from '../context/SettingContext';

function Navbar({className}) {
    const {darkTheme} = useTheme()
    const {items} = useSetting()
    const {setting, setSetting} = useSetting()
    const handleSetting = () => {
        setSetting(
            true
        )
    }
    useEffect(() => {
        const handleWindowClick = () => {
            setSetting(false)
        }
        window.addEventListener("click", handleWindowClick)
        
        return () => {
            window.removeEventListener("click", handleWindowClick)
        }
    }, [])
    
    return (
        
            <div className={className }>
                <div className={`flex justify-between items-center h-full ${darkTheme? "bg-gray-900 text-white border-gray-800 ": "bg-white border-gray-100"} border-b px-4`}>
                    <h1 className='font-["pacifico"] text-lg '>Twitchflix</h1>
                    {
                        items &&
                        <div className='cursor-pointer md:px-14'  onClick={
                        (e) => {
                            
                            e.stopPropagation()
                            handleSetting()
                        }
                        }>
                        <span class="material-symbols-outlined">
                        more_vert
                        </span>
                    </div>
                    }   
                </div>
            </div>
    );
}

export default Navbar;