import ApiError from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {v2 as cloudinary} from "cloudinary"
import { upload } from "../middlewares/multer.middleware.js";

const publishAVideo = asyncHandler( async (req, res) => {
    const {title, description} = req.body

    if(
        [title, description].some(
        (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const videoFileLocalPath = req.files?.videoFile[0].path
    if(!videoFileLocalPath) throw new ApiError(400, "videoFile is required")

    const thumbnailLocalPath = req.files?.thumbnail[0].path
    if(!thumbnailLocalPath) throw new ApiError(400, "thumbnail is required")

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile) throw new ApiError(400, "something went wrong")
    if(!thumbnail) throw new ApiError(400, "something went wrong")

    const uploadedVideo = await  Video.create({
        videoFile: videoFile.url,
        videoFilePublicId: videoFile.public_id,
        thumbnail: thumbnail.url,
        thumbnailPublicId: thumbnail.public_id,
        title,
        description,
        duration: videoFile.duration,
        owner: req.user._id

    })
    const createdVideo = await Video.findById(uploadedVideo._id)
    .populate("owner", "username fullname avatar")

    if(!createdVideo) throw new ApiError(501, "something went wrong while uploading the video")
    
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    createdVideo,
                    "video published successfully"
                )
            )
})

const getAllVideos = asyncHandler( async (req, res) => {
    const {
        page = 1,
        limit =  10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query

    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)
    const skip = (pageNumber - 1)* limitNumber

    const filter = {isPublished: true}

    if(query) {
        filter.title = {
            $regex: query,
            $options: "i"
        }
    }
    if(userId) {
        filter.owner = userId
    }

    const sortingOptions = {}

    sortingOptions[sortBy] = sortType === "asc"? 1: -1

    const videos = await Video.find(filter)
        .populate("owner", "fullname username avatar")
        .sort(sortingOptions)
        .skip(skip)
        .limit(limitNumber)

    const totalVideos = await Video.countDocuments(filter)


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videos,
                    pagination: {
                        totalVideos,
                        currentPage: pageNumber,
                        totalPages: Math.ceil(totalVideos / limitNumber),
                        limit: limitNumber
                    }
                },
                "videos fetched successfully"   
            )
        )
})

const getVideoById = asyncHandler( async (req, res) => {
    const {videoId} = req.params

    if(!videoId) throw new ApiError(400, "videoId is required")
    
    const getVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {
                views: 1
            }
        },
        {
            new: true
        }
    )
        .populate("owner", "fullname username avatar")

    if(!getVideo) throw new ApiError(400, "no video found")
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                getVideo,
                "video found successfully"
            )
        )
})

const updateVideo = asyncHandler( async (req, res) => {
    const {videoId} = req.params
    if(!videoId) throw new ApiError(400, "videoId is required")

    const {title, description} = req.body

    const video = await Video.findById(videoId)
    if(!video) throw new ApiError(400, "no video found")

    if(video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "unauthorised access")
    }
    
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    let thumbnailUrl = video.thumbnail
    let thumbnailPublicId = video.thumbnailPublicId

    if(thumbnailLocalPath) {
        if(video.thumbnailPublicId) {
            await cloudinary.uploader.destroy(video.thumbnailPublicId)
        }
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnail.url) throw new ApiError(400, "thumbnail is not found")

        thumbnailUrl = thumbnail.url
        thumbnailPublicId = thumbnail.public_id
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        video._id,
        {
            $set: {
                thumbnail: thumbnailUrl,
                thumbnailPublicId: thumbnailPublicId,
                title: title || video.title,
                description: description || video.description
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "video updated successfully"
            )
        )
})

const deleteVideo = asyncHandler( async (req, res) => {
    const {videoId} = req.params
    if(!videoId) throw new ApiError(400, "videoId is required")

    const video = await Video.findById(videoId)
    if(!video) throw new ApiError(400, "no video found")
    
    if(video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "unauthorised access")
    }
    
    if(video.videoFilePublicId) {
        await cloudinary.uploader.destroy(
            video.videoFilePublicId,
            {
                resource_type: "video"
            }
        )
    }
    await cloudinary.uploader.destroy(
        video.thumbnailPublicId
    )

    await Video.findByIdAndDelete(video._id)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "video deleted successfully"
            )
        )
})

const togglePublish = asyncHandler( async (req, res) => {
    const {videoId} = req.params
    if(!videoId) throw new ApiError(400, "videoId is required")

    const video = await Video.findById(videoId)
    if(!video) throw new ApiError(400, "no video found")
    
    if(video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "unauthorised access")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        {
            new: true
        }
    )
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "video updated successfully"
            )
        )
})

export {
    publishAVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublish
}