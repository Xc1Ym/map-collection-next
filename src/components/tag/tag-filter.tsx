"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTags } from "@/hooks/use-tags";

interface TagFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TagFilter({ value, onChange }: TagFilterProps) {
  const { tags, isLoading } = useTags();
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    function handleClick(e: MouseEvent) {
      if (btnRef.current && btnRef.current.contains(e.target as Node)) return;
      setMoreOpen(false);
    }
    function handleResize() {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        left: Math.min(rect.left, window.innerWidth - 160),
      });
    }
    document.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [moreOpen]);

  if (isLoading) return null;

  const VISIBLE = 3;
  const visibleTags = tags.slice(0, VISIBLE);
  const restTags = tags.slice(VISIBLE);
  const selectedInRest = restTags.find((t) => t.name === value);

  function handleMoreClick() {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      left: Math.min(rect.left, window.innerWidth - 160),
    });
    setMoreOpen((prev) => !prev);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => onChange("")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              value === ""
                ? "text-white shadow-sm"
                : "bg-white text-[oklch(0.45_0.02_60)] border border-[oklch(0.88_0.04_50)] hover:border-[oklch(0.75_0.12_40)]"
            }`}
            style={value === "" ? { backgroundImage: "var(--brand-gradient)" } : undefined}
          >
            所有
          </button>
          {visibleTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onChange(tag.name === value ? "" : tag.name)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                value === tag.name
                  ? "text-white shadow-sm"
                  : "bg-white text-[oklch(0.45_0.02_60)] border border-[oklch(0.88_0.04_50)] hover:border-[oklch(0.75_0.12_40)]"
              }`}
              style={value === tag.name ? { backgroundColor: tag.color } : undefined}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {restTags.length > 0 && (
          <button
            ref={btnRef}
            type="button"
            onClick={handleMoreClick}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap ${
              selectedInRest
                ? "text-white border-transparent shadow-sm"
                : "bg-white text-[oklch(0.45_0.02_60)] border-[oklch(0.88_0.04_50)] hover:border-[oklch(0.75_0.12_40)]"
            }`}
            style={selectedInRest ? { backgroundColor: selectedInRest.color } : undefined}
          >
            {selectedInRest ? selectedInRest.name : "更多"}
            <svg className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {moreOpen && createPortal(
        <div
          className="fixed bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[oklch(0.91_0.02_75)] py-1.5 z-[9999] min-w-[140px] max-h-[240px] overflow-y-auto"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {restTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => {
                onChange(tag.name === value ? "" : tag.name);
                setMoreOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-[oklch(0.955_0.02_75)] transition-colors flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
              <span className={value === tag.name ? "font-semibold text-[oklch(0.25_0.02_60)]" : "text-[oklch(0.40_0.02_60)]"}>
                {tag.name}
              </span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
