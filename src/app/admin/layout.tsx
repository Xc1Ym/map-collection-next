import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  if (!isAdmin) {
    redirect("/login");
  }

  return (
    <div className="max-w-[1200px] mx-auto p-5">
      <div className="flex flex-wrap justify-between items-center mb-6 bg-white/80 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60 gap-3">
        <h1
          className="text-2xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: "var(--brand-gradient)" }}
        >
          管理后台
        </h1>
        <div className="flex gap-3">
          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[oklch(0.88_0.04_50)] text-[oklch(0.40_0.05_40)] hover:bg-[oklch(0.935_0.05_50)]"
            >
              商家管理
            </Button>
          </Link>
          <Link href="/admin/tags">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[oklch(0.88_0.04_50)] text-[oklch(0.40_0.05_40)] hover:bg-[oklch(0.935_0.05_50)]"
            >
              标签管理
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="default"
              size="sm"
              className="text-white rounded-xl"
              style={{ backgroundImage: "var(--brand-gradient)" }}
            >
              返回地图
            </Button>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
