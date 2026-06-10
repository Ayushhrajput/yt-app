import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
export const app = express();
app.set("trust proxy", 1)


const allowedOrigins = [
    "https://yt-app-woq1.vercel.app",
    "http://localhost:5173"
]
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/subscription", subscriptionRouter)

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "internal server error"
    })
})
