import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.jsx';
import { changeFullName, updateProfile } from '../services/authservice.js';
import LoaderBar from '../components/Loaders/LoaderBar.jsx';
import { useNavigate } from 'react-router-dom';

function EditUserInfo(props) {

    const {user, setUser} = useAuth()
    const {darkTheme} = useTheme()

    const navigate =  useNavigate()

    const [profile, setProfile] = useState(null)
    const [profilePreview, setProfilePreview] = useState(user.avatar)
    const [updateStatus, setUpdateStatus] = useState(false)

    const [fullnamePreview, setFullnamePreview] = useState(user.fullName)
    
    
    

    useEffect(() => {
        setProfilePreview(user.avatar)
    }, [user.avatar])


    const handleSubmit = async (e) => {
      e.preventDefault()

      if(updateStatus) return
      try {
        
        setUpdateStatus(true)

        let updatedUser = user
        if(profile) {
            const response = await updateProfile(profile)
            updatedUser = response.data
            
        }
        
        if(!(fullnamePreview === user.fullName)) {
            console.log("error - e")
            
            const response = await changeFullName(
                fullnamePreview
            )
            console.log("e")
            updatedUser = response.data
            
            
        }

        setUser(updatedUser)
        
        navigate(`/profile/${updatedUser.username}`)

        
        
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

                <div className={`w-full max-w-sm h-max py-4 flex gap-2 items-center flex-col border-b ${darkTheme? "border-white/10": "border-black/10"}`}>
                    
                    <div >
                        
                        <label 
                            className={`    flex items-center justify-center gap-2 ${darkTheme? "bg-white/10 rounded-full": ""} cursor-pointer`}
                            htmlFor="profile"
                        >
                            <div>
                                <img
                                    className='w-25 h-auto aspect-1/1 object-cover rounded-full'
                                    src={profilePreview} alt="" 
                                />
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
                <div className={`w-full max-w-sm h-max py-2 flex items-center flex-col border-b ${darkTheme? "border-white/10": "border-black/10"}`}>
                    <div className='w-full  px-2'>
                        <input 
                            placeholder="FullName"
                            className='w-full'
                            type="text" 
                            onChange={
                                (e) => {
                                    setFullnamePreview(e.target.value)
                                }
                            }
                            value={fullnamePreview}
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
                                <div>Save</div>
                            )
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditUserInfo;