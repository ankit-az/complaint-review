import { NextResponse } from "next/server";
import { getCategoryBySlug } from "@/data/categoriesData";

export async function GET(request, { params }) {
  const { slug } = await params;
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
    message: "Category details retrieved",
    data: { category },
  });
}
