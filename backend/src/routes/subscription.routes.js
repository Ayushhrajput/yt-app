import { Router } from "express";
import { deleteSubscription, subscribeChannel, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/c/:channelId").post(
    verifyJWT,
    subscribeChannel
)
router.route("/c/:channelId").delete(
    verifyJWT,
    deleteSubscription
)
router.route("/c/toggle/:channelId").post(
    verifyJWT,
    toggleSubscription
)
export default router

