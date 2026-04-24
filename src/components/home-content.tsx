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
      className={`rounded-full px-5 py-3 text-base font-medium transition-all cursor-pointer border-2 ${
        active
          ? "bg-green-500 border-green-500 text-white shadow-sm"
          : "bg-white border-gray-200 text-gray-700 hover:border-green-300"
      }`}
    >
      {active ? "已吃" : "只看已吃"}
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
    <div className="max-w-[1400px] mx-auto p-3 md:p-5">
      <SiteHeader />

      {/* 桌面端：筛选栏 */}
      <div className="hidden lg:flex items-center gap-4 mb-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1">
          <TagFilter value={tagFilter} onChange={setTagFilter} />
        </div>
        <VisitedToggle active={visitedOnly} onChange={setVisitedOnly} />
      </div>

      {/* 桌面端：三栏布局 */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 max-h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">商家列表</h3>
          <BusinessList businesses={businesses} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <AmapContainer businesses={businesses} />
        </div>
      </div>

      {/* 移动端：地图 + 浮层 + 列表 */}
      <div className="lg:hidden space-y-4">
        <div className="relative">
          <AmapContainer businesses={businesses} />
          {/* 筛选浮在地图上方 */}
          <div className="absolute top-3 left-3 right-3 z-10 flex gap-2">
            <div className="flex-1">
              <TagFilter value={tagFilter} onChange={setTagFilter} />
            </div>
            <VisitedToggle active={visitedOnly} onChange={setVisitedOnly} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">商家列表</h3>
          <BusinessList businesses={businesses} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
