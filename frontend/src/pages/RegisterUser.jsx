import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authservice.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

function RegisterUser() {
    const navigate = useNavigate()
    const {setUser} = useAuth()
    const {darkTheme} = useTheme()
    
    const [avatarPreview, setAvatarPreview] = useState("")
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("")

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    })
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await registerUser(
                formData,
                avatar,
                coverImage
            )
            setUser(response.data.user)
            navigate('/home')
            setSuccess(response.message)
            console.log(avatar)
            setError("")
        } catch (err) {
            setError(err.message)
            setSuccess("")
        }
    }
    

    return (
        <div className={`min-h-screen w-full ${darkTheme? "bg-black/90 text-white": "bg-gray-100"} flex justify-center items-center px-4`}>

            <div className={`w-full max-w-sm sm:max-w-xl h-min shadow-2xl ${darkTheme? "shadow-black/40 bg-black/40": "shadow-gray-200 bg-white"}  rounded-2xl  p-8 `}>
                <h1 className="text-3xl font-bold text-center w-max">
                    Create Account
                </h1>

                <p className=" text-center w-max mb-4">
                    Register to continue
                </p>
                <form className="flex flex-col sm:flex-row sm:items-center justify-around gap-4 " onSubmit={handleSubmit}>
                    <div className='w-full flex sm:justify-center'>
                        
                        <div className="flex flex-col items-center w-max">
                            <label 
                                htmlFor="avatar"
                                className={`w-16 sm:w-25 aspect-square cursor-pointer flex justify-center  items-center ${darkTheme?"bg-black/20 text-white shadow-black/20 border-black/20": "bg-white shadow-white/90 border-black/10"} backdrop-blur shadow-lg border rounded-full overflow-hidden`}
                            >
                                {!avatar?<i class="fa-solid fa-file-arrow-up text-2xl sm:text-4xl"></i> : <img src={avatarPreview} className="w-full h-full object-cover  " />}
                            </label>
                            <label className="text-sm font-medium ">
                                Profile
                            </label>
                            <input
                                id='avatar'
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0]
                                    setAvatar(file)
                                    if(file) {
                                        setAvatarPreview(URL.createObjectURL(file))
                                    }
                                }}
                                className="
                                    hidden
                                "
                            />
                        </div>
                        
                    </div>
                    <div className='w-full flex flex-col gap-4'>

                        <input 
                            className={`max-w-sm  ${darkTheme? " border-black/60": "border-black/20"} border-b   py-2 outline-none  `}
                            type="text"
                            name='fullName'
                            placeholder='FullName'
                            onChange={handleChange}/>
                        <input 
                            className={`max-w-sm  ${darkTheme? " border-black/60": "border-black/20"} border-b   py-2 outline-none  `}
                            type="text" 
                            name='username' 
                            placeholder='Username'
                            onChange={handleChange}/>
                        <input 
                            className={`max-w-sm  ${darkTheme? " border-black/60": "border-black/20"} border-b   py-2 outline-none  `} 
                            type="text" 
                            name='email' 
                            placeholder='Email'
                            onChange={handleChange}/>
                        <input 
                            className={`max-w-sm  ${darkTheme? " border-black/60": "border-black/20"} border-b   py-2 outline-none  `} 
                            type="text" 
                            name='password'
                            placeholder='Password' 
                            onChange={handleChange}/>
                        
                        <button 
                            className="
                                max-w-sm
                                bg-linear-to-tl from-blue-500 to-blue-400
                                hover:bg-gray-800
                                text-white
                                font-semibold
                                py-3
                                rounded-xl
                                transition
                                duration-200
                                shadow-lg
                            "
                            type="submit">Register</button>
                    </div>
                        
                </form>
                {error && 
                (<p className='text-red-500 text-sm mt-2'>
                    {error}
                </p>)
                }
                {success && 
                <p className='text-sm mt-2'>
                    {success}
                </p>
                }
                <div className='flex gap-2 mt-4 text-center text-sm'>
                    <p className=''>Have an account</p>
                    <Link
                        to="/login"
                        className={`italic hover:underline ${darkTheme? "text-gray-400": "text-gray-600"} `}
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterUser;