"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <header className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 mb-5">
      <h1 className="text-2xl font-bold text-gray-900">地图收藏系统</h1>
      <div className="flex items-center gap-3">
        {session?.user ? (
          <>
            <span className="text-sm text-gray-600">
              欢迎, {session.user.name}
            </span>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="default" size="sm">
                  管理后台
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              退出
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="default" size="sm">
              登录
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
