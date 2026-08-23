import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middleware.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import {v2 as cloudinary} from "cloudinary"
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
    let user
    let accessToken
    let refreshToken
    try {
        user = await User.findById(userId)
        accessToken = await user.generateAccessToken()
        refreshToken = await user.generateRefreshToken()

    } catch (error) {
        throw new ApiError(500, "something went wrong")
    }

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false})


    return {accessToken, refreshToken}
}

const registerUser = asyncHandler( async (req, res) => {
    
    const {username, fullName, email, password} = req.body

    if(
        [fullName, username, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "all fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser) throw new ApiError(409, "user already exists")   
    const avatarLocalPath = req.files?.avatar?.[0]?.path


    
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path
 

    if(!avatarLocalPath) throw new ApiError(400, "avatar is required")

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage  = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) throw new ApiError(400, "avatar is required")

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        avatarPublicId: avatar.public_id,
        coverImage: coverImage?.url || "",
        coverImagePublicId: coverImage?.public_id || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) throw new ApiError(500, "something wernt wrong")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )

    
})
const loginUser = asyncHandler( async (req, res) => {
    const {username, email, password} = req.body

    if(!(username || email)) throw new ApiError(400, "username or email is required")

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(400, "wrong credentials")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) throw new ApiError(401, "invalid credentials")

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken
    }, "user loggedIn successfully"))
})
const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, 
        {
           $unset: {
            refreshToken: 1
           }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "user logged out")
    )
})

const refreshAccessToken = asyncHandler( async (req, res) => {
    try {
        const getRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if(!getRefreshToken) {
            throw new ApiError(401, "unauthorized access")
        }
        const decodedToken = jwt.verify(getRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id)
    
        if(!user) throw new ApiError(401, "INVALID REFERSH TOKEN")
        
        if(getRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "refresh token is expired")
        }
    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res.status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", newRefreshToken)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "accessToken refreshed"
            )
            
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refreshToken")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) {
        throw new ApiError(400, "invalid password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200).json(
        new ApiResponse(200, {}, "password changed successfully")
    )
    

})

const getUser = asyncHandler(async (req, res) => {
    return res.status(200)
    .json(new ApiResponse(200, req.user, "user fetched successfully"))
})

const updateAccountDetails  = asyncHandler(async (req, res) => {
    const {username, email} = req.body

    if(!(username || email)){
        throw new ApiError(400, "username or email is required")
    }

    const user = User.findByIdAndUpdate(req.user._id, {
        $set: {
            username,
            email: email
        }
    }, {
        new: true
    }).select("-password")

    
    return res.status(200)
    .json(
        new ApiResponse(200, user, "user updated successfully")
    )
})

const updateFullName = asyncHandler(async (req, res) => {
    const {fullName} = req.body

    if(!fullName) {
        throw new ApiError(400, "Fullname is required!")
    }

    const user = User.findByIdAndUpdate(req.user._id, {
        $set: {
            fullName
        }
    }, {
        new: true
    }).select("-password")

    return res.status(200).
        json(
            new ApiResponse(200, user, "user updated successfully")
        )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    
    if(!avatarLocalPath) throw new ApiError(400, "avatar file is not found")

    const user = await User.findById(req.user._id)
    
    if(user.avatarPublicId){
        await cloudinary.uploader.destroy(user.avatarPublicId)
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url) throw new ApiError(400, "error while avatar upload")
    
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatar.url,
            avatarPublicId: avatar.public_id
        }
    }, {
        new: true
    }).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(200, updatedUser, "avatar updated successfully")
    )

})
const updateUsercoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    
    if(!coverImageLocalPath) throw new ApiError(400, "coverImage   file is not found")
    
    const user = await User.findById(req.user._id)
    
    if(user.coverImagePublicId){
        await cloudinary.uploader.destroy(user.coverImagePublicId)
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url) throw new ApiError(400, "error while coverImag upload")
    
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            coverImage: coverImage.url,
            coverImagePublicId: coverImage.public_id
        }
    }, {
        new: true
    }).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(200, user, "coverImage updated successfully")
    )

})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const {username} = req.params

    if(!username?.trim()) throw new ApiError(400, "user not found")

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }            
            
        }, {
            $project: {
                username: 1,
                fullName: 1,
                subscribers: 1,
                subscribedTo: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                
            }
        }
    ])
    if(!channel?.length) throw new ApiError(404, "channel not found")
    console.log(JSON.stringify(channel, null, 2))
    return res.json(
        new ApiResponse(
            200,
            channel[0]
        )
    )
})
const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    
    const videos = await Video.find({ owner: userId });

    
    for (const video of videos) {
        if (video.videoFile?.public_id) {
            await deleteFromCloudinary(
                video.videoFile.public_id,
                "video"
            );
}       if (video.thumbnail?.public_id) {
            await deleteFromCloudinary(
                video.thumbnail.public_id,
                "image"
            );
}

        
    }

    
    await Video.deleteMany({ owner: userId });

    
    if (user.avatar?.public_id) {
        await deleteFromCloudinary(user.avatar.public_id);
    }

    
    await User.findByIdAndDelete(userId);

    
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Account and all associated data deleted successfully"
            )
        );
});


const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "WatchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(
        new ApiResponse(
            200, 
            user?.[0]?.WatchHistory,
            "watchHistory fetched successfully"
        )
    )
})

const addToWatchHistory = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull : {
                watchHistory: videoId
            }
        }
    )
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $push : {
                watchHistory: {
                    $each: [videoId],
                    $position: 0
                }
            }
        }
    )
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Added to WatchHistory"
        )
    )
})
export {registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword,
    getUser,
    updateAccountDetails,
    updateFullName,
    updateUserAvatar,
    updateUsercoverImage,
    getUserChannelProfile,
    deleteAccount,
    getWatchHistory,
    addToWatchHistory
}