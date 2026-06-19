import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import RegisterUser from './pages/RegisterUser.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import AuthLayout from './components/layout/AuthLayout.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Layout from './components/layout/Layout.jsx'
import Profile from './pages/Profile.jsx'
import PostVideo from './pages/PostVideo.jsx'
import VideoPage from './pages/Video.jsx'
import { useFeatures } from './context/FeaturesContext.jsx'
import Feed from './pages/Feed.jsx'
import LoaderBar from './components/Loaders/LoaderBar.jsx'
import VideoSkeleton from './components/Loaders/VideoSkeleton.jsx'
import Search from './pages/Search.jsx'


function App() {
  
  const {user, loading} = useAuth()
  const location = useLocation()
  const {showNav, setShowNav} = useFeatures()
  setShowNav(!location.pathname.startsWith('/home/video/') && !location.pathname.startsWith("/feed") && !location.pathname.startsWith("/postVideo") && !location.pathname.startsWith('/search/video') && !location.pathname.startsWith('/search'))
  
  
  
  
  if(loading) {
    return (
      <div></div>
    )
  }

  return (
      
      <Routes>
        
        <Route element={<AuthLayout/>}>
          <Route path='/' element={
            user? <Navigate to="/home" /> : <Navigate to="/login"/>
            
          }/>
          <Route path='/register' element={<RegisterUser/>}/>
          <Route path='/login' element={<Login/>}/>
        </Route>
        <Route element={
          user? <Layout/> : <Navigate to="/login"/>
        }>
          <Route path='/home' element={<Home/>}/>
          <Route path='/profile/:username' element={<Profile/>}/>
          <Route path='/postVideo' element={<PostVideo/>}/>
          <Route path='/home/video/:videoId' element={<VideoPage/>}/>
          <Route path='/feed' element={<Feed/>} />
          <Route path='/search' element={<Search/>} />
          <Route path='/search/video/:videoId' element={<VideoPage/>} />
        </Route>
      </Routes>
  )
}

export default App
