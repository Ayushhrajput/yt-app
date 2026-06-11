import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authservice.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

function RegisterUser() {
    const navigate = useNavigate()
    const {setUser} = useAuth()
    const {darkTheme} = useTheme()
    

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
        <div className={`min-h-screen w-full ${darkTheme? "bg-gray-800 text-white": "bg-gray-100"} flex justify-center items-center px-4`}>

            <div className={`w-full max-w-md h-min shadow-2xl ${darkTheme? "shadow-gray-800": "shadow-gray-200"}  rounded-2xl  p-8`}>
                <h1 className="text-3xl font-bold text-center  mb-2">
                    Create Account
                </h1>

                <p className=" text-center mb-8">
                    Register to continue
                </p>
                <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
                    <input 
                        className={`w-full  ${darkTheme? "bg-gray-800 text-white": "bg-gray-100"}  rounded-xl px-4 py-3 outline-none  `}
                        type="text"
                        name='fullName'
                        placeholder='Full Name'
                        onChange={handleChange}/>
                    <input 
                        className={`w-full  ${darkTheme? "bg-gray-800 text-white": "bg-gray-100"}  rounded-xl px-4 py-3 outline-none  `}
                        type="text" 
                        name='username' 
                        placeholder='Username'
                        onChange={handleChange}/>
                    <input 
                        className={`w-full  ${darkTheme? "bg-gray-800 text-white": "bg-gray-100"}  rounded-xl px-4 py-3 outline-none  `} 
                        type="text" 
                        name='email' 
                        placeholder='Email'
                        onChange={handleChange}/>
                    <input 
                        className={`w-full  ${darkTheme? "bg-gray-800 text-white": "bg-gray-100"}  rounded-xl px-4 py-3 outline-none  `} 
                        type="text" 
                        name='password'
                        placeholder='Password' 
                        onChange={handleChange}/>
                    <div className='flex justify-between'>
                        <div className="flex flex-col ">
                            <label className="text-sm font-medium ">
                                Avatar
                            </label>
                            <label 
                                htmlFor="avatar"
                                className={`h-10 ${!avatar? "w-10": "w-full"} cursor-pointer flex justify-center  items-center ${!avatar?"bg-blue-500 text-white": "bg-gray-100"} rounded-lg overflow-hidden`}
                            >
                                {!avatar?<i class="fa-solid fa-file w-full"></i>: <div className='w-25 truncate'>{avatar.name}</div>}
                            </label>
                            <input
                                id='avatar'
                                type="file"
                                onChange={(e) => setAvatar(e.target.files[0])}
                                className="
                                    hidden
                                "
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium ">
                                Cover Image (optional)
                            </label>
                            <label 
                                htmlFor="coverImage"
                                className={`h-10 ${!coverImage? "w-10": "w-25"} cursor-pointer flex justify-center items-center ${!coverImage?"bg-blue-500 text-white": "bg-gray-100"} rounded-lg overflow-hidden `}
                            >
                                {!coverImage?<i class="fa-solid fa-file w-full"></i>: <div className='w-25 truncate'>{coverImage.name}</div>}
                            </label>
                            <input
                                id='coverImage'
                                type="file"
                                onChange={(e) => setCoverImage(e.target.files[0])}
                                className="
                                     hidden
                                "
                            />
                        </div>

                    </div>
                    <button 
                        className="
                            w-full
                            bg-linear-to-tl from-red-600 to-red-500
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
                        className='italic hover:underline '
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterUser;