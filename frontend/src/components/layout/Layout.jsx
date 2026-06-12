import React, {useState, useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import BottomBar from '../BottomBar';
import Navbar from '../Navbar.jsx';
import Sidebar from '../Sidebar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx'; 

function Layout(props) {
    const [showNav, setShowNav] = useState(true)
    const {darkTheme} = useTheme()

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
            <aside className='hidden md:block sticky top-0  max-h-screen  '>
                <Sidebar/>
            </aside>
            <div className={`flex-1 ${darkTheme? "bg-gray-900 ": "bg-white "}`}>
                <Navbar className={`sticky top-0 w-full h-14 transition-transform duration-200  ${showNav? "translate-y-0": "-translate-y-full"}`}/>
                <main className='pt-14'>
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