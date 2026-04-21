import type { Business } from "@/types";
import { BusinessCard } from "./business-card";

interface BusinessListProps {
  businesses: Business[];
  isLoading: boolean;
}

export function BusinessList({ businesses, isLoading }: BusinessListProps) {
  if (isLoading) {
    return (
      <div className="text-center text-gray-400 py-8 italic">加载中...</div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">暂无商家数据</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-600">
        找到 {businesses.length} 个结果
      </div>
      {businesses.map((b) => (
        <BusinessCard key={b.id} business={b} />
      ))}
    </div>
  );
}
