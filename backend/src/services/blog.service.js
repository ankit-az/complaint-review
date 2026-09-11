import { prisma } from "../config/db.js";

/**
 * Helper to format a BlogPost database record for API / frontend compatibility
 */
const formatPost = (post) => {
  if (!post) return null;
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    categoryId: post.categoryId,
    categorySlug: post.categorySlug,
    categoryName: post.categoryName,
    categoryLabel: post.categoryName,
    author: {
      name: post.authorName,
      role: post.authorRole,
      avatar: post.authorAvatar,
    },
    readTime: post.readTime,
    date: post.date,
    featured: post.featured,
    image: post.imageUrl,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

/**
 * Get all blog categories from PostgreSQL with article counts
 */
export const getBlogCategories = async () => {
  const categories = await prisma.blogCategory.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return [
    {
      id: "featured",
      slug: "featured",
      href: "/blog",
      label: "Featured",
      name: "Featured",
      description: "The latest insights, trending research, and expert perspectives on consumer trust.",
    },
    ...categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      href: `/blog/${cat.slug}`,
      label: cat.name,
      name: cat.name,
      description: cat.description,
      count: cat._count?.posts || 0,
    })),
  ];
};

/**
 * Query blog posts from PostgreSQL with filtering, search, and pagination
 */
export const getBlogPosts = async ({
  category,
  search,
  featured,
  page = 1,
  limit = 50,
} = {}) => {
  const where = {};

  if (category && category !== "featured") {
    where.categorySlug = category;
  }

  if (featured === true || featured === "true") {
    where.featured = true;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { categoryName: { contains: search, mode: "insensitive" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.max(1, parseInt(limit, 10) || 50);
  const skip = (pageNum - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.blogPost.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return {
    posts: posts.map(formatPost),
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalPosts: total,
      pageSize,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

/**
 * Retrieve a single blog post by slug from PostgreSQL
 */
export const getBlogPostBySlug = async (slug) => {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  return formatPost(post);
};

/**
 * Retrieve blog posts grouped by category directly from PostgreSQL
 */
export const getPostsGroupedByCategory = async () => {
  const categories = await prisma.blogCategory.findMany({
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return categories.map((cat) => ({
    category: {
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
    },
    posts: cat.posts.map(formatPost),
    totalCount: cat._count?.posts || 0,
  }));
};

export default {
  getBlogCategories,
  getBlogPosts,
  getBlogPostBySlug,
  getPostsGroupedByCategory,
};
