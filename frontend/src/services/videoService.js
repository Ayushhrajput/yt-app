import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

const publishVideo = async (formdata) => {
    try {
        const response = api.post(
            "/api/v1/video/publish-video",
            formdata,
    
        )
        return response.data

    } catch (e) {
        throw new Error(e.response?.data?.message || e.message || "something went wrong")
    }
}


const getVideoById = async (videoId) => {
    try {
        const response = await api.get(
            `/api/v1/video/${videoId}`
        )
        return response.data
    } catch (e) {
        throw new Error(e.response?.data?.message || e.message || "something went wrong")
    }
}

export {
    publishVideo
}