import { NextResponse } from "next/server";
import api from "@/lib/api";
import { getAllCategories } from "@/data/categoriesData";

export async function GET() {
  try {
    const res = await api.get("/categories");
    if (res?.success && res.data?.categories) {
      return NextResponse.json(res);
    }
  } catch (err) {
    console.warn("Backend categories proxy request failed, falling back to static schema:", err.message);
  }

  const categories = getAllCategories();
  return NextResponse.json({
    success: true,
    message: "Categories retrieved successfully (fallback)",
    data: { categories },
  });
}
