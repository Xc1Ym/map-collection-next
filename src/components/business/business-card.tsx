import type { Business } from "@/types";
import { TagBadge } from "@/components/tag/tag-badge";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{business.name}</h4>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {business.tags.length > 0 ? (
          business.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)
        ) : (
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white bg-gray-400">
            未分类
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">{business.address}</p>
      {business.phone && (
        <p className="text-sm text-gray-500 mt-1">电话: {business.phone}</p>
      )}
      <div className="mt-3">
        <a
          href={`https://uri.amap.com/marker?position=${business.longitude},${business.latitude}&name=${encodeURIComponent(business.name)}&coordinate=gaode&callnative=1`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
        >
          高德地图导航
        </a>
      </div>
    </div>
  );
}
