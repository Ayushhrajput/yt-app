import React, { useState } from 'react';
import { loginUser } from '../services/authservice';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

function Login(props) {
    const {user, setUser} = useAuth()
    const {darkTheme} = useTheme()
    const navigate = useNavigate()
    

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    }) 
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await loginUser(formData)
            
            setUser(response.data.user)
            
            navigate('/home')

            setSuccess(response.message)
            setError("")
        } catch (e) {
            setError(e.message)
            setSuccess("")
        }
    }

    return (
        <div className={`min-h-screen w-full flex justify-center items-center px-4 ${darkTheme? "bg-black/90 text-white": "bg-gray-100"}`}>
            <div className={`w-full  max-w-sm h-min shadow-2xl ${darkTheme? "shadow-black/40 bg-black/40": "shadow-gray-200 bg-white"}  rounded-2xl  p-8`}>
                <h1 className="text-3xl font-bold text-center w-max  mb-2">
                    Login
                </h1>

                <p className=" text-center w-max mb-4">
                    Login to continue
                </p>
                
                <form onSubmit={handleSubmit} className=''>
                    <div className='w-full flex flex-col items-center gap-4'>
                        <input 
                            type="text" 
                            value={formData.email}
                            name='email'
                            placeholder='Email'
                            onChange={handleChange}
                            className={`max-w-sm w-full ${darkTheme? " border-black/60": "border-black/20"} border-b   py-2 outline-none  `}
                        />
                        <input 
                            type="text" 
                            value={formData.password}
                            name='password'
                            placeholder='Password'
                            onChange={handleChange}
                            className={`max-w-sm w-full ${darkTheme? " border-black/60": "border-black/20"} border-b   py-2 outline-none  `}
                        />
                        <button 
                            className="
                                max-w-sm w-full
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
                            type="submit"
                        >Login</button>
                    </div>
                </form>
                {
                    error &&
                        <p className='text-red-500 text-sm mt-2'>
                            {error}
                        </p>
                    
                }
                {
                    success && (
                        <p className='text-sm mt-2'>
                            {success}
                        </p>
                        
                    )
                }
                <div className='flex gap-2 mt-4 text-center text-sm'>
                    <p className=''>Don't have an account</p>
                    <Link
                        to="/register"
                        className='italic hover:underline '
                    >
                        Register
                    </Link>
                </div>
                
            </div>
        </div>
    );
}

export default Login;