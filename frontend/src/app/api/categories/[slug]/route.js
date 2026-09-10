import { NextResponse } from "next/server";
import api from "@/lib/api";
import { getCategoryBySlug } from "@/data/categoriesData";

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    const res = await api.get(`/categories/${slug}`);
    if (res?.success && res.data?.category) {
      return NextResponse.json(res);
    }
  } catch (err) {
    console.warn(`Backend category ${slug} proxy request failed, falling back:`, err.message);
  }

  const category = getCategoryBySlug(slug);

  if (!category) {
    return NextResponse.json(
      {
        success: false,
        message: "Category not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Category details retrieved (fallback)",
    data: { category },
  });
}
