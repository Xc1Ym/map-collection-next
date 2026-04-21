"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchResult {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
}

interface AmapSearchProps {
  onSelect: (result: SearchResult) => void;
}

export function AmapSearch({ onSelect }: AmapSearchProps) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  async function handleSearch() {
    if (!keyword.trim()) return;
    setLoading(true);
    setShowResults(true);

    try {
      const res = await fetch(
        `/api/amap/search?q=${encodeURIComponent(keyword)}&city=西安`
      );
      const data = await res.json();
      setResults(data.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="输入商家名称搜索..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "搜索中..." : "搜索"}
        </Button>
      </div>

      {showResults && (
        <div className="max-h-[300px] overflow-y-auto border rounded-lg">
          {results.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              {loading ? "搜索中..." : "未找到相关地点"}
            </div>
          ) : (
            results.map((r, i) => (
              <div
                key={i}
                className="p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  onSelect(r);
                  setShowResults(false);
                  setKeyword(r.name);
                }}
              >
                <div className="font-medium text-gray-800">{r.name}</div>
                <div className="text-sm text-gray-500">{r.address}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
