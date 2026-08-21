import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINAY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        console.log(res)
        return res
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
    } catch (error) {
        console.error(
            `Failed to delete ${publicId} from Cloudinary:`,
            error
        );
    }
};
export {uploadOnCloudinary, deleteFromCloudinary}