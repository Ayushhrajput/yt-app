import React, {useState, useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import BottomBar from '../BottomBar';
import Navbar from '../Navbar.jsx';
function Layout(props) {
    const [showNav, setShowNav] = useState(true)
    

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
    console.log(showNav)

    return (
        
        <div className='flex'>
            <aside className='hidden md:block sticky top-0 min-w-56 h-screen bg-blue-400 shadow-lg shadow-gray-200'>
                <div></div>
            </aside>
            <div className='flex-1'>
                <Navbar className={`sticky top-0 w-full h-14 transition-transform duration-200  ${showNav? "translate-y-0": "-translate-y-full"}`}/>
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