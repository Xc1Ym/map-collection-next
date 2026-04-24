import { NextRequest, NextResponse } from "next/server";
import { searchPlace } from "@/lib/amap";
import { searchSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const parsed = searchSchema.safeParse({
    q: request.nextUrl.searchParams.get("q") || "",
    city: request.nextUrl.searchParams.get("city") || "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 }
    );
  }

  try {
    const results = await searchPlace(parsed.data.q, parsed.data.city);
    return NextResponse.json({ success: true, data: results });
  } catch {
    return NextResponse.json({ error: "搜索服务暂时不可用" }, { status: 502 });
  }
}
