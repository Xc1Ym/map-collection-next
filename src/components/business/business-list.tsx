import type { Business } from "@/types";
import { BusinessCard } from "./business-card";

interface BusinessListProps {
  businesses: Business[];
  isLoading: boolean;
}

export function BusinessList({ businesses, isLoading }: BusinessListProps) {
  if (isLoading) {
    return (
      <div className="text-center text-[oklch(0.60_0.02_60)] py-8 italic">加载中...</div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center text-[oklch(0.60_0.02_60)] py-8">暂无商家数据</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-[oklch(0.50_0.02_60)]">
        找到 {businesses.length} 个结果
      </div>
      {businesses.map((b) => (
        <BusinessCard key={b.id} business={b} />
      ))}
    </div>
  );
}
