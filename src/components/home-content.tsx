"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { TagFilter } from "@/components/tag/tag-filter";
import { BusinessList } from "@/components/business/business-list";
import { AmapContainer } from "@/components/map/amap-container";
import { useBusinesses } from "@/hooks/use-businesses";

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
        <label className="inline-flex items-center gap-2 cursor-pointer select-none whitespace-nowrap">
          <input
            type="checkbox"
            checked={visitedOnly}
            onChange={(e) => setVisitedOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm font-medium text-gray-700">只看已吃</span>
        </label>
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
            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap bg-white rounded-full border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={visitedOnly}
                onChange={(e) => setVisitedOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              已吃
            </label>
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
