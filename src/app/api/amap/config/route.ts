import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    apiKey: process.env.AMAP_JS_API_KEY || "",
    securityJsCode: process.env.AMAP_SECURITY_KEY || "",
    mapVersion: "2.0",
  });
}
