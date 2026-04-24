import type { Business } from "@/types";
import { BusinessCard } from "./business-card";

interface BusinessListProps {
  businesses: Business[];
  isLoading: boolean;
  onCardClick?: (business: Business) => void;
}

export function BusinessList({ businesses, isLoading, onCardClick }: BusinessListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/60 animate-pulse p-5 pl-7 rounded-2xl">
            <div className="h-5 bg-[oklch(0.92_0.01_75)] rounded-lg w-2/3 mb-3" />
            <div className="flex gap-1.5 mb-3">
              <div className="h-5 bg-[oklch(0.92_0.01_75)] rounded-full w-12" />
              <div className="h-5 bg-[oklch(0.92_0.01_75)] rounded-full w-16" />
            </div>
            <div className="h-4 bg-[oklch(0.92_0.01_75)] rounded-lg w-full" />
          </div>
        ))}
      </div>
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
        <BusinessCard key={b.id} business={b} onClick={() => onCardClick?.(b)} />
      ))}
    </div>
  );
}
