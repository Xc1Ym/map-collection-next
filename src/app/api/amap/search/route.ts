import { NextRequest, NextResponse } from "next/server";
import { searchPlace } from "@/lib/amap";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const city = request.nextUrl.searchParams.get("city") || "";

  if (!q) {
    return NextResponse.json({ error: "请输入搜索关键词" }, { status: 400 });
  }

  try {
    const results = await searchPlace(q, city);
    return NextResponse.json({ success: true, data: results });
  } catch {
    return NextResponse.json({ error: "搜索失败" }, { status: 500 });
  }
}
