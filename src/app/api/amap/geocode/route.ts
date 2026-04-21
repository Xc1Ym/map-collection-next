import { NextRequest, NextResponse } from "next/server";
import { reverseGeocode } from "@/lib/amap";

export async function GET(request: NextRequest) {
  const lng = parseFloat(request.nextUrl.searchParams.get("lng") || "");
  const lat = parseFloat(request.nextUrl.searchParams.get("lat") || "");

  if (isNaN(lng) || isNaN(lat)) {
    return NextResponse.json({ error: "经纬度参数缺失" }, { status: 400 });
  }

  try {
    const address = await reverseGeocode(lng, lat);
    return NextResponse.json({ success: true, data: { formatted_address: address } });
  } catch {
    return NextResponse.json({ error: "逆地理编码失败" }, { status: 500 });
  }
}
