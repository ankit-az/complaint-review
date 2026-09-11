import { NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET() {
  try {
    const res = await api.get("/categories");
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch categories",
      },
      { status: err.statusCode || 500 }
    );
  }
}
