import type { Business } from "@/types";
import { TagBadge } from "@/components/tag/tag-badge";
import { StarRatingDisplay } from "@/components/ui/star-rating";

interface BusinessCardProps {
  business: Business;
  onClick?: () => void;
}

export function BusinessCard({ business, onClick }: BusinessCardProps) {
  const accentColor = business.tags[0]?.color || "oklch(0.62 0.18 25)";

  return (
    <div
      onClick={onClick}
      className="relative bg-white/95 p-5 pl-7 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-lg font-semibold text-[oklch(0.25_0.02_60)]">{business.name}</h4>
        {business.visited && (
          <span className="shrink-0 rounded-full bg-[oklch(0.92_0.06_165)] px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.45_0.12_165)]">
            ✓ 已吃
          </span>
        )}
      </div>
      {business.visited && business.rating != null && (
        <div className="mb-2">
          <StarRatingDisplay rating={business.rating} />
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {business.tags.length > 0 ? (
          business.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)
        ) : (
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white bg-[oklch(0.65_0.02_60)]">
            未分类
          </span>
        )}
      </div>
      <p className="text-sm text-[oklch(0.45_0.02_60)]">{business.address}</p>
      {business.phone && (
        <p className="text-sm text-[oklch(0.55_0.02_60)] mt-1">电话: {business.phone}</p>
      )}
      <div className="mt-3">
        <a
          href={`https://uri.amap.com/marker?position=${business.longitude},${business.latitude}&name=${encodeURIComponent(business.name)}&coordinate=gaode&callnative=1`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:shadow-md"
          style={{ backgroundImage: "var(--brand-gradient)" }}
        >
          高德地图导航
        </a>
      </div>
    </div>
  );
}
