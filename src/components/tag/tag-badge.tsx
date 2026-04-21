import type { Tag } from "@/types";

interface TagBadgeProps {
  tag: Tag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
      style={{ backgroundColor: tag.color }}
    >
      {tag.name}
    </span>
  );
}
