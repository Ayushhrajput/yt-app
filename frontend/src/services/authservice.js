import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

const refreshToken = async () => {
    try {
        const response = await api.post(
            "/api/v1/users/refresh-token"
        )
        return response.data
    } catch (e) {
        throw new Error(e.response?.data?.message || e.message || "something went wrong")
    }
}

api.interceptors.response.use(
    (response) => (response),
    async (error) => {
        const originalRequest = error.config

        if(
            error.response?.status === 401 && 
            !originalRequest._retry && originalRequest.url !== "/api/v1/users/refresh-token"
        ) {
            originalRequest._retry = true

            try {
                await refreshToken()
                return api(originalRequest)
            } catch (e) {
                return Promise.reject(e)
            }
        }
        return Promise.reject(error)
        
    }
)


const registerUser = async (formData, avatar, coverImage) => {
    
    try {

        const data = new FormData()
        
        data.append("fullName", formData.fullName)
        data.append("username", formData.username)
        data.append("email", formData.email)
        data.append("password", formData.password)
    
        data.append("avatar", avatar)
        
        if(coverImage) data.append("coverImage", coverImage)
     
        const response = await api.post(
            `/api/v1/users/register`,
            data,
            
        )
        return response.data
        
    } catch (e) {
        
        throw new Error(e.response?.data?.message || e.message || "something went wrong")
    }
    
}

const loginUser = async (formdata) => {

    try {
        const response = await api.post(
            "/api/v1/users/login", 
            formdata,
        )
        return response.data
    } catch (e) {
        throw new Error(e.response?.data?.message || e.message || "something went wrong")
    }
}

const logout = async () => {
    try {
        const response = await api.post(
            "/api/v1/users/logout"
        )
        return response.data
    } catch (e) {
        throw new Error(e.response.data.message || e.message || "something went wrong")
    }
}

const getCurrUser = async () => {
    try {
        const response = await api.get(
            "/api/v1/users/get-user"
        )
        return response.data
    } catch (e) {
        throw new Error(e.response?.data?.message || e.message || "something went wrong")
    }
}
const getUserChannel = async (username) => {
    try {
        const response = await api.get(
            `/api/v1/users/c/${username}`
        )
        
        return response.data
    } catch (e) {
        throw new Error(e.response?.data?.message || e.message || "something went wrong")
    }
}
export {
    registerUser,
    loginUser,
    logout,
    getCurrUser,
    refreshToken,
    getUserChannel
}