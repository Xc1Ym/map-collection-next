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
      <div className="flex justify-between items-center mb-6 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
        <div className="flex gap-3">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              商家管理
            </Button>
          </Link>
          <Link href="/admin/tags">
            <Button variant="outline" size="sm">
              标签管理
            </Button>
          </Link>
          <Link href="/">
            <Button variant="default" size="sm">
              返回地图
            </Button>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
