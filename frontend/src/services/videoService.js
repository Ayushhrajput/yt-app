import axios from "axios"
import { useParams } from "react-router-dom"
const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

const publishVideo = async (formdata) => {
    try {
        const response = api.post(
            "/api/v1/videos/publish-video",
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
            `/api/v1/videos/${videoId}`
        )
        return response.data
    } catch (e) {
        throw new Error(e.response?.data?.message || e.message || "something went wrong")
    }
}
const getAllVideos = async ({
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId = "",
} = {}) => {
        const response = await api.get(
            `/api/v1/videos/`,
            {
                params: {
                    page,
                    limit,
                    query,
                    sortBy,
                    sortType,
                    userId,
                }
            }
        )
        return response.data
}
export {
    publishVideo,
    getVideoById,
    getAllVideos
}