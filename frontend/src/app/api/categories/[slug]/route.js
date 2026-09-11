import { NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    const res = await api.get(`/categories/${slug}`);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Category not found",
      },
      { status: err.statusCode || 404 }
    );
  }
}
