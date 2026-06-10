import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

const subscribeChannel = asyncHandler( async (req, res) => {
    const {channelId} = req.params
    const subscriberId = req.user._id

    if(subscriberId.toString() === channelId) {
        throw new ApiError(400, "cannot subscribe to your channel")
    }

    const alreadySubscribed = await Subscription.findOne(
        {
            subscriber: subscriberId,
            channel: channelId
        }
    )
    if(alreadySubscribed) throw new ApiError(400, "channel already subscribed")

    const subscription = await Subscription.create({
        subscriber: subscriberId,
        channel: channelId
    })

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            subscription,
            "subscribed successfully"
        )
    )
})

const deleteSubscription = asyncHandler( async (req, res) => {

    const {channelId} = req.params
    const subscriberId = req.user._id

    const subscription = await Subscription.findOneAndDelete({
       channel: channelId,
       subscriber: subscriberId
    })

    if(!subscription) {
        throw new ApiError(400, "subscription not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "unsubscribed successfully"
        )
    )
})

const toggleSubscription = asyncHandler( async (req, res) => {
    const {channelId} = req.params

    if(req.user._id.toString() === channelId) {
        throw new ApiError(400, "cannot subscribe to your channel")
    }

    const existedSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    })

    if(existedSubscription) {
        await Subscription.findByIdAndDelete(existedSubscription._id)

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "unsubscribed successfully"
            )
        )
    }
    const subscription = await Subscription.create({
        channel: channelId,
        subscriber: req.user._id
    })
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            subscription,
            "subscribed successfully"
        )
    )

})

export {
    subscribeChannel,
    deleteSubscription,
    toggleSubscription
}

