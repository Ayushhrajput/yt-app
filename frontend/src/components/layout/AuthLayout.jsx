import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout(props) {
    return (
        <div>
            <Outlet/>
        </div>
    );
}

export default AuthLayout;