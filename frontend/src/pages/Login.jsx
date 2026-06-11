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
        <div className={`min-h-screen w-full flex justify-center items-center px-4 ${darkTheme? "bg-gray-900 text-white": "bg-white"}`}>
            <div className='w-full max-w-md h-min shadow-lg shadow-gray-800 rounded-2xl  p-8'>
                <h1 className="text-3xl font-bold text-center  mb-2">
                    Login
                </h1>

                <p className=" text-center mb-8">
                    Login to continue
                </p>
                
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <input 
                        type="text" 
                        value={formData.email}
                        name='email'
                        placeholder='Email'
                        onChange={handleChange}
                        className={`w-full  ${darkTheme? "bg-gray-800 text-white": "bg-gray-100"}  rounded-xl px-4 py-3 outline-none  `}
                    />
                    <input 
                        type="text" 
                        value={formData.password}
                        name='password'
                        placeholder='Password'
                        onChange={handleChange}
                        className={`w-full  ${darkTheme? "bg-gray-800 text-white": "bg-gray-100"}  rounded-xl px-4 py-3 outline-none  `}
                    />
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
                        type="submit"
                    >Login</button>
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