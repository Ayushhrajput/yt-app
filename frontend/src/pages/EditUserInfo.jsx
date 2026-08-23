import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.jsx';
import { updateProfile } from '../services/authservice.js';
import LoaderBar from '../components/Loaders/LoaderBar.jsx';
import { useNavigate } from 'react-router-dom';

function EditUserInfo(props) {

    const {user, setUser} = useAuth()
    const {darkTheme} = useTheme()

    const navigate =  useNavigate()

    const [profile, setProfile] = useState(null)
    const [profilePreview, setProfilePreview] = useState(user.avatar)
    const [updateStatus, setUpdateStatus] = useState(false)

    useEffect(() => {
        setProfilePreview(user.avatar)
    }, [user.avatar])
    const handleSubmit = async (e) => {
      e.preventDefault()

      if(updateStatus) return
      try {
        
        
        setUpdateStatus(true)
        if(profile) {
            const response = await updateProfile(profile)
            setUser(response.data)
            navigate('/profile/:username')
            
        }
        
        
      } catch (e) {
        console.error(e)
        
        
      } finally {
        setUpdateStatus(false)

      }
        
    }


    return (
        <div className='min-h-screen w-full px-4'>
            <div className='flex flex-col items-center gap-y-10'>
                <h1 className='w-full text-2xl font-bold'>
                    Update Your Profile
                </h1>

                <div className={`w-full h-max py-4 flex gap-2 items-center flex-col border-b ${darkTheme? "border-white/10": "border-black/10"}`}>
                    <img
                        className='w-25 h-auto aspect-1/1 object-cover rounded-full'
                        src={profilePreview} alt="" 
                    />
                    <div >
                        
                        <label 
                            className={`  w-10 h-auto aspect-square  flex items-center justify-center gap-2 ${darkTheme? "bg-white/10 rounded-full": ""} cursor-pointer`}
                            htmlFor="profile"
                        >
                            <div className='flex flex-col items-center'>
                                
                                <div className=''>
                                    <i class="fa-solid fa-file-arrow-up "></i>
                                </div>
                            </div>
                        </label>
                        
                        <input 
                            id='profile'
                            type="file" 
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                setProfile(file)
                                if(file) setProfilePreview(URL.createObjectURL(file))
                            }}

                            hidden
                        />
                    </div>
                    
                </div>
                
                <div className='w-full max-w-sm'>
                    <button
                     className={`w-full h-12  px-8  ${darkTheme? "bg-neutral-800 border-t border-white/10": "bg-white border border-black/10"}  rounded-full cursor-pointer`}
                     onClick={handleSubmit}
                    >
                        {
                            updateStatus? (
                                <div >
                                    <LoaderBar/>
                                </div>
                            ): (
                                <div>Update</div>
                            )
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditUserInfo;