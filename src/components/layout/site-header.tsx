"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  function toggle() {
    setDark((prev) => !prev);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-xl p-2 border border-[oklch(0.88_0.04_50)] hover:bg-[oklch(0.935_0.05_50)] transition-colors cursor-pointer"
      aria-label={dark ? "切换亮色模式" : "切换暗色模式"}
    >
      {dark ? (
        <svg className="w-4 h-4 text-[oklch(0.75_0.16_65)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-[oklch(0.40_0.05_40)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

export function SiteHeader() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <header className="relative flex justify-between items-center bg-white/80 dark:bg-[oklch(0.22_0.01_60)]/80 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60 dark:border-white/10 mb-5">
      <h1
        className="text-2xl font-bold bg-clip-text text-transparent"
        style={{ backgroundImage: "var(--brand-gradient)" }}
      >
        美食收藏地图
      </h1>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {session?.user ? (
          <>
            <span className="hidden sm:inline text-sm text-[oklch(0.50_0.02_60)] dark:text-[oklch(0.70_0.02_60)]">
              欢迎, {session.user.name}
            </span>
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="default"
                  size="sm"
                  className="text-white rounded-xl"
                  style={{ backgroundImage: "var(--brand-gradient)" }}
                >
                  管理后台
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[oklch(0.88_0.04_50)] text-[oklch(0.40_0.05_40)] hover:bg-[oklch(0.935_0.05_50)] dark:border-white/10 dark:text-[oklch(0.70_0.02_60)] dark:hover:bg-white/10"
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
              className="text-white rounded-xl"
              style={{ backgroundImage: "var(--brand-gradient)" }}
            >
              登录
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
