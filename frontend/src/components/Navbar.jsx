import React from 'react';

function Navbar({className}) {
    return (
        
            <div className={className }>
                <div className='flex justify-between items-center h-full bg-white px-4'>
                    <h1 className='font-["pacifico"] text-lg '>Twitchflix</h1>
                    
                </div>
            </div>
    );
}

export default Navbar;