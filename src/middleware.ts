import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const adminOnlyPaths = ["/admin"];
const adminOnlyApiPaths = ["/api/amap/search", "/api/amap/geocode"];

function startsWithAny(path: string, prefixes: string[]) {
  return prefixes.some((p) => path.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态文件和 NextAuth 内部路由
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAdmin = token?.role === "ADMIN";

  // 管理后台页面需要 admin 角色
  if (startsWithAny(pathname, adminOnlyPaths) && !isAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 管理 API 需要 admin 角色
  if (startsWithAny(pathname, adminOnlyApiPaths) && !isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  // POST/PATCH/DELETE 到 API 路由需要 admin
  const method = request.method;
  if (
    (method === "POST" || method === "PATCH" || method === "DELETE") &&
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth")
  ) {
    if (!isAdmin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
