import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import RegisterUser from './pages/RegisterUser.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import AuthLayout from './components/layout/AuthLayout.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Layout from './components/layout/Layout.jsx'
import Profile from './pages/Profile.jsx'
import PostVideo from './pages/PostVideo.jsx'

function App() {
  
  const {user, loading} = useAuth()
  
  if(loading) {
    return (
      <h1>loading!</h1>
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
        </Route>
      </Routes>
  )
}

export default App
