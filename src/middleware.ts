import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const adminOnlyPaths = ["/admin"];
const adminOnlyApiPaths = ["/api/amap/search", "/api/amap/geocode"];

function startsWithAny(path: string, prefixes: string[]) {
  return prefixes.some((p) => path.startsWith(p));
}

// --- Login rate limiting ---
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_LOGIN_ATTEMPTS = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isLoginRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }

  record.count++;
  return record.count > MAX_LOGIN_ATTEMPTS;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login rate limiting
  if (pathname === "/api/auth/callback/credentials" && request.method === "POST") {
    const ip = getClientIp(request);
    if (isLoginRateLimited(ip)) {
      return NextResponse.json(
        { error: "登录尝试过于频繁，请稍后再试" },
        { status: 429 }
      );
    }
  }

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
