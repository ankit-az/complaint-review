import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const BLOG_CLOUDINARY_FOLDER = "complaint-review/Blog";

/**
 * Upload an image buffer or remote URL directly to Cloudinary into complaint-review/Blog
 * @param {Buffer|string} fileSource - File buffer or image URL
 * @param {Object} [customOptions={}] - Additional cloudinary upload options
 * @returns {Promise<Object>} Upload result { url, secure_url, public_id, ... }
 */
export const uploadBlogImage = async (fileSource, customOptions = {}) => {
  const options = {
    folder: BLOG_CLOUDINARY_FOLDER,
    resource_type: "image",
    transformation: [
      { quality: "auto", fetch_format: "auto" },
    ],
    ...customOptions,
  };

  if (typeof fileSource === "string") {
    // Remote URL or data URI
    return await cloudinary.uploader.upload(fileSource, options);
  }

  // Buffer upload via upload_stream
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(fileSource);
  });
};

/**
 * Delete an image by its public_id
 * @param {string} publicId
 */
export const deleteBlogImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
