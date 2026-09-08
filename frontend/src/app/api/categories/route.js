import { NextResponse } from "next/server";
import { getAllCategories } from "@/data/categoriesData";

export async function GET() {
  const categories = getAllCategories();
  return NextResponse.json({
    success: true,
    message: "Categories retrieved successfully",
    data: { categories },
  });
}
