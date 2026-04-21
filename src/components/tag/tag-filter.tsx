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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-full border-2 border-gray-200 px-5 py-3 text-base bg-white cursor-pointer focus:border-blue-400 focus:outline-none transition-colors"
    >
      <option value="">所有分类</option>
      {tags.map((tag) => (
        <option key={tag.id} value={tag.name}>
          {tag.name}
        </option>
      ))}
    </select>
  );
}
