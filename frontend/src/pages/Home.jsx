import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {getUserChannel, logout} from "../services/authservice.js"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { getAllVideos } from '../services/videoService.js';


function Home(props) {

    
    return (
        <div>
        
        </div>
    );
}

export default Home;