import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublish, updateVideo } from "../controllers/video.controller.js";

const router = Router()

router.route("/publish-video").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
)

router.route("/").get(getAllVideos)
router.route("/:videoId").get(getVideoById)
router.route("/:videoId").patch(
    verifyJWT,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    updateVideo
)
router.route("/:videoId").delete(
    verifyJWT,
    deleteVideo
)
router.route("/:videoId/toggle-publish").patch(verifyJWT, togglePublish)

export default router