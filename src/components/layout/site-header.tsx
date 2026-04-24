"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <header className="relative flex justify-between items-center bg-white/80 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60 mb-5">
      <h1
        className="text-2xl font-bold bg-clip-text text-transparent"
        style={{ backgroundImage: "var(--brand-gradient)" }}
      >
        美食收藏地图
      </h1>
      <div className="flex items-center gap-3">
        {session?.user ? (
          <>
            <span className="text-sm text-[oklch(0.50_0.02_60)]">
              欢迎, {session.user.name}
            </span>
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[oklch(0.62_0.18_25)] hover:bg-[oklch(0.55_0.18_25)] text-white rounded-xl"
                >
                  管理后台
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[oklch(0.88_0.04_50)] text-[oklch(0.40_0.05_40)] hover:bg-[oklch(0.935_0.05_50)]"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              退出
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button
              variant="default"
              size="sm"
              className="bg-[oklch(0.62_0.18_25)] hover:bg-[oklch(0.55_0.18_25)] text-white rounded-xl"
            >
              登录
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
