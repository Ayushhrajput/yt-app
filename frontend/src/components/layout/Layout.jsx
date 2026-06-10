import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomBar from '../BottomBar';

function Layout(props) {
    return (
        
        <div className='flex'>
            <aside className='hidden md:block min-w-56 h-screen bg-white shadow-lg shadow-gray-200'>

            </aside>
            <main className='flex-1'>
                <Outlet/>
            </main>
            <div className='md:hidden'>
                <BottomBar/>
            </div>
        </div>
        
    );
}

export default Layout;