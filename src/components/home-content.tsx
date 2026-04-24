"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { TagFilter } from "@/components/tag/tag-filter";
import { BusinessList } from "@/components/business/business-list";
import { AmapContainer } from "@/components/map/amap-container";
import { useBusinesses } from "@/hooks/use-businesses";

function VisitedToggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all cursor-pointer border ${
        active
          ? "bg-[oklch(0.70_0.15_165)] border-[oklch(0.70_0.15_165)] text-white shadow-sm"
          : "bg-white border-[oklch(0.88_0.04_50)] text-[oklch(0.45_0.02_60)] hover:border-[oklch(0.70_0.15_165)]"
      }`}
    >
      {active ? "✓ 已吃" : "只看已吃"}
    </button>
  );
}

export default function HomeContent() {
  const [tagFilter, setTagFilter] = useState("");
  const [visitedOnly, setVisitedOnly] = useState(false);
  const { businesses, isLoading } = useBusinesses(
    tagFilter || undefined,
    visitedOnly || undefined
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6">
      <SiteHeader />

      {/* 桌面端：筛选栏 */}
      <div className="hidden lg:flex items-center gap-4 mb-6 bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60">
        <div className="flex-1">
          <TagFilter value={tagFilter} onChange={setTagFilter} />
        </div>
        <VisitedToggle active={visitedOnly} onChange={setVisitedOnly} />
      </div>

      {/* 桌面端：三栏布局 */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60 max-h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold text-[oklch(0.30_0.02_60)] mb-4">商家列表</h3>
          <BusinessList businesses={businesses} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <AmapContainer businesses={businesses} />
        </div>
      </div>

      {/* 移动端：地图 + 浮层 + 列表 */}
      <div className="lg:hidden space-y-5">
        <div className="relative">
          <AmapContainer businesses={businesses} />
          <div className="absolute top-3 left-3 right-3 z-10 flex gap-2">
            <div className="flex-1 min-w-0">
              <TagFilter value={tagFilter} onChange={setTagFilter} />
            </div>
            <VisitedToggle active={visitedOnly} onChange={setVisitedOnly} />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60">
          <h3 className="text-lg font-semibold text-[oklch(0.30_0.02_60)] mb-3">商家列表</h3>
          <BusinessList businesses={businesses} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
