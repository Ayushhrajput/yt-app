import React, {useState, useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import BottomBar from '../BottomBar';
import Navbar from '../Navbar.jsx';
import Sidebar from '../Sidebar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx'; 
import { useSetting } from '../../context/SettingContext.jsx';

function Layout(props) {
    const [showNavbar, setShowNav] = useState(true)
    const {darkTheme} = useTheme()
    const {showNav} = useSetting(0)
    useEffect(() => {
        let lastScrollY = window.scrollY

        const handleScrollY = () => {
            const currScrollY = window.scrollY

            if(currScrollY > lastScrollY) {
                setShowNav(false)
            } else {
                setShowNav(true)
            }
            lastScrollY = currScrollY
        }
        window.addEventListener("scroll", handleScrollY)
        return () => { window.removeEventListener("scroll", handleScrollY) }
    }, [])
    

    return (
        
        <div className='flex'>
            <aside className='hidden md:block sticky  left-0 '>
                <Sidebar/>
            </aside>
            <div className={`flex-1 ${darkTheme? "bg-black/90 ": "bg-white "} overflow-y-auto scrollbar-hide`}>
                {showNav && 
                    <Navbar className={`fixed top-0 w-full h-14 transition-transform duration-200  ${showNavbar? "translate-y-0": "-translate-y-full"}`}/>
                }
                <main className=''>
                    <Outlet/>
                </main>
            </div>
            <div className='md:hidden'>
                <BottomBar/>
            </div>
        </div>
        
    );
}

export default Layout;