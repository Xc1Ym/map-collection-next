"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("用户名或密码错误");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      {/* 装饰性渐变圆 */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl" style={{ background: "oklch(0.62 0.18 25)" }} />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "oklch(0.75 0.16 65)" }} />

      <div className="relative w-full max-w-sm bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/60">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--brand-gradient)" }}
          >
            美食收藏地图
          </h1>
          <p className="text-sm text-[oklch(0.55_0.02_60)] mt-2">登录以管理你的美食收藏</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[oklch(0.35_0.02_60)]">用户名</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              className="rounded-xl border-[oklch(0.88_0.04_50)] focus:border-[oklch(0.62_0.18_25)] focus:ring-[oklch(0.62_0.18_25)]/20"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[oklch(0.35_0.02_60)]">密码</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="rounded-xl border-[oklch(0.88_0.04_50)] focus:border-[oklch(0.62_0.18_25)] focus:ring-[oklch(0.62_0.18_25)]/20"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-white rounded-xl py-2.5"
            style={{ backgroundImage: "var(--brand-gradient)" }}
          >
            {loading ? "登录中..." : "登录"}
          </Button>
        </form>
      </div>
    </div>
  );
}
