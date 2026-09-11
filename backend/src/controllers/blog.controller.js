import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";
import blogService from "../services/blog.service.js";
import { uploadBlogImage } from "../config/cloudinary.js";

export const getBlogPosts = asyncHandler(async (req, res) => {
  const { category, search, featured, page, limit, grouped } = req.query;

  if (grouped === "true" || grouped === true) {
    const groupedData = await blogService.getPostsGroupedByCategory();
    return sendSuccess(
      res,
      { sections: groupedData },
      "Grouped blog posts retrieved successfully"
    );
  }

  const result = await blogService.getBlogPosts({
    category,
    search,
    featured,
    page,
    limit,
  });

  return sendSuccess(
    res,
    {
      posts: result.posts,
      pagination: result.pagination,
      count: result.posts.length,
    },
    "Blog posts retrieved successfully"
  );
});

export const getBlogCategories = asyncHandler(async (req, res) => {
  const categories = await blogService.getBlogCategories();
  return sendSuccess(
    res,
    { categories },
    "Blog categories retrieved successfully"
  );
});

export const getBlogPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const post = await blogService.getBlogPostBySlug(slug);

  if (!post) {
    throw new AppError("Article not found", 404);
  }

  return sendSuccess(res, { post }, "Article retrieved successfully");
});

export const uploadBlogImageController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("No image file uploaded", 400);
  }

  const uploadResult = await uploadBlogImage(req.file.buffer, {
    public_id: `blog_${Date.now()}`,
  });

  return sendSuccess(
    res,
    {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      folder: "complaint-review/Blog",
    },
    "Image uploaded to Cloudinary successfully (complaint-review/Blog)",
    201
  );
});

export default {
  getBlogPosts,
  getBlogCategories,
  getBlogPostBySlug,
  uploadBlogImageController,
};
