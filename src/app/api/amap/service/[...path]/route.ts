import { NextRequest, NextResponse } from "next/server";

const SECURITY_KEY = process.env.AMAP_SECURITY_KEY || "";
const SERVER_API_KEY = process.env.AMAP_SERVER_API_KEY || "";
const AMAP_REST = "https://restapi.amap.com";
const AMAP_WEB = "https://webapi.amap.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const apiPath = path.join("/");
  const isRest = apiPath.startsWith("v3");

  const base = isRest ? AMAP_REST : AMAP_WEB;
  const sp = new URLSearchParams(request.nextUrl.searchParams);

  // REST API requires server-side key; web API uses JS key
  if (isRest) {
    sp.set("key", SERVER_API_KEY);
  }
  sp.set("jscode", SECURITY_KEY);

  const targetUrl = `${base}/${apiPath}?${sp.toString()}`;

  try {
    const res = await fetch(targetUrl, {
      headers: { "Accept-Encoding": "gzip" },
    });
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type":
          res.headers.get("Content-Type") || "application/json",
        "Access-Control-Allow-Origin": request.nextUrl.origin,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "AMap proxy failed" },
      { status: 502 }
    );
  }
}
