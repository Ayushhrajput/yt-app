import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useFeatures } from '../context/FeaturesContext.jsx';

function Navbar({className}) {
    const {darkTheme} = useTheme()
    const {items} = useFeatures()
    const {toast, setToast} = useFeatures()
    const handletoast = () => {
        setToast(
            true
        )
    }
    useEffect(() => {
        const handleWindowClick = () => {
            setToast(false)
        }
        window.addEventListener("click", handleWindowClick)
        
        return () => {
            window.removeEventListener("click", handleWindowClick)
        }
    }, [])
    
    return (
        
            <div className={className }>
                <div className={`flex justify-between items-center h-full ${darkTheme? "bg-black/10  text-white border-black/20 ": "bg-white/10 border-black/20"} backdrop-blur border-b px-4`}>
                    <h1 className='font-["pacifico"] text-lg '>Twitchflix</h1>
                    {
                        items &&
                        <div className='cursor-pointer md:px-14 flex items-center'  onClick={
                        (e) => {
                            
                            e.stopPropagation()
                            handletoast()
                        }
                        }>
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                    }   
                </div>
            </div>
    );
}

export default Navbar;