"use client";

import { useTags } from "@/hooks/use-tags";

interface TagFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TagFilter({ value, onChange }: TagFilterProps) {
  const { tags, isLoading } = useTags();

  if (isLoading) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
          value === ""
            ? "text-white shadow-sm"
            : "bg-white text-[oklch(0.45_0.02_60)] border border-[oklch(0.88_0.04_50)] hover:border-[oklch(0.75_0.12_40)]"
        }`}
        style={
          value === ""
            ? { backgroundImage: "var(--brand-gradient)" }
            : undefined
        }
      >
        所有分类
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          onClick={() => onChange(tag.name === value ? "" : tag.name)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
            value === tag.name
              ? "text-white shadow-sm"
              : "bg-white text-[oklch(0.45_0.02_60)] border border-[oklch(0.88_0.04_50)] hover:border-[oklch(0.75_0.12_40)]"
          }`}
          style={
            value === tag.name
              ? { backgroundColor: tag.color }
              : undefined
          }
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
