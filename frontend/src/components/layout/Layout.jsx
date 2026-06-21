import React, {useState, useEffect} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomBar from '../BottomBar';
import Navbar from '../Navbar.jsx';
import Sidebar from '../Sidebar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx'; 
import { useFeatures } from '../../context/FeaturesContext.jsx';

function Layout(props) {
    const [showNavbar, setShowNav] = useState(true)
    const {darkTheme} = useTheme()
    const {showNav} = useFeatures()
    const [showBottombar, setShowBottomBar] = useState(true)
    const {bottomBar, setBottomBar} = useFeatures()


    const location = useLocation()

    useEffect(
        () => {
            setShowBottomBar(!location.pathname.startsWith('/feed') && !location.pathname.startsWith('/home/video')  && !location.pathname.startsWith('/video'))
        },
    [location.pathname])

    

    useEffect(() => {
        let lastScrollY = window.scrollY

        const handleScrollY = () => {
            const currScrollY = window.scrollY

            if(currScrollY > lastScrollY) {
                setShowNav(false)
                setBottomBar(false)
            } else {
                setShowNav(true)
                setBottomBar(true)
            }
            lastScrollY = currScrollY
        }
        window.addEventListener("scroll", handleScrollY)
        return () => { window.removeEventListener("scroll", handleScrollY) }
    }, [])
    

    return (
        
        <div className='flex'>
            <aside className='hidden md:block  z-20'>
                <Sidebar/>
            </aside>
            <div className={`flex-1 ${darkTheme? "bg-black/90 ": "bg-white "} overflow-y-auto scrollbar-hide md:pl-14`}>
                {showNav && 
                    <Navbar className={`fixed top-0 w-full h-14 transition-transform duration-200  ${showNavbar? "translate-y-0": "-translate-y-full"} z-10`}/>
                }
                <main className={`${darkTheme? "text-white": ""} ${showNav? "pt-14": ""} `}>
                    <Outlet/>
                </main>
            </div>
            <div className='md:hidden z-10'>
                { showBottombar && <BottomBar/>}
            </div>
        </div>
        
    );
}

export default Layout;