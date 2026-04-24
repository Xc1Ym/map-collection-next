"use client";

import { useState, useCallback, useRef } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { TagFilter } from "@/components/tag/tag-filter";
import { BusinessList } from "@/components/business/business-list";
import { AmapContainer } from "@/components/map/amap-container";
import { useBusinesses } from "@/hooks/use-businesses";
import type { Business } from "@/types";

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

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.55_0.02_60)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索商家名称或地址..."
        className="w-full rounded-full border border-[oklch(0.88_0.04_50)] bg-white pl-10 pr-4 py-2.5 text-sm placeholder:text-[oklch(0.65_0.02_60)] focus:border-[oklch(0.62_0.18_25)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.18_25)]/20 transition-all"
      />
    </div>
  );
}

export default function HomeContent() {
  const [tagFilter, setTagFilter] = useState("");
  const [visitedOnly, setVisitedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const mapRef = useRef<{ flyTo: (b: Business) => void } | null>(null);

  const { businesses, isLoading } = useBusinesses(
    tagFilter || undefined,
    visitedOnly || undefined,
    search || undefined
  );

  const handleCardClick = useCallback((business: Business) => {
    setActiveBusiness(business);
    mapRef.current?.flyTo(business);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6">
      <SiteHeader />

      {/* 桌面端：筛选栏 */}
      <div className="hidden lg:flex items-center gap-4 mb-6 bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60">
        <div className="w-64 shrink-0">
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <div className="flex-1">
          <TagFilter value={tagFilter} onChange={setTagFilter} />
        </div>
        <VisitedToggle active={visitedOnly} onChange={setVisitedOnly} />
      </div>

      {/* 桌面端：三栏布局 */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60 max-h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold text-[oklch(0.30_0.02_60)] mb-4">商家列表</h3>
          <BusinessList businesses={businesses} isLoading={isLoading} onCardClick={handleCardClick} />
        </div>
        <div className="lg:col-span-2">
          <AmapContainer
            ref={mapRef}
            businesses={businesses}
            activeBusiness={activeBusiness}
            onMarkerClick={setActiveBusiness}
          />
        </div>
      </div>

      {/* 移动端：地图 + 浮层 + 列表 */}
      <div className="lg:hidden space-y-5">
        <div className="space-y-3">
          <SearchInput value={search} onChange={setSearch} />
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <TagFilter value={tagFilter} onChange={setTagFilter} />
            </div>
            <VisitedToggle active={visitedOnly} onChange={setVisitedOnly} />
          </div>
        </div>
        <div className="relative">
          <AmapContainer
            ref={mapRef}
            businesses={businesses}
            activeBusiness={activeBusiness}
            onMarkerClick={setActiveBusiness}
          />
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60">
          <h3 className="text-lg font-semibold text-[oklch(0.30_0.02_60)] mb-3">商家列表</h3>
          <BusinessList businesses={businesses} isLoading={isLoading} onCardClick={handleCardClick} />
        </div>
      </div>
    </div>
  );
}
