"use client";

import { useState } from "react";
import { useTags } from "@/hooks/use-tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import type { Tag } from "@/types";

export default function TagsPage() {
  const { tags, isLoading, mutate } = useTags();
  const [newTagName, setNewTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("标签添加成功");
        setNewTagName("");
        mutate();
      } else {
        toast.error(data.error || "添加失败");
      }
    } catch {
      toast.error("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/tags/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("标签删除成功");
        mutate();
      } else {
        toast.error(data.error || "删除失败");
      }
    } catch {
      toast.error("网络错误，请重试");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function moveTag(tag: Tag, direction: "up" | "down") {
    const sorted = [...tags];
    const idx = sorted.findIndex((t) => t.id === tag.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    [sorted[idx], sorted[swapIdx]] = [sorted[swapIdx], sorted[idx]];

    try {
      await Promise.all(
        sorted.map((t, i) =>
          fetch(`/api/tags/${t.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: i }),
          })
        )
      );
      mutate();
    } catch {
      toast.error("排序失败，请重试");
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60 space-y-6">
      <h2 className="text-xl font-semibold text-[oklch(0.25_0.02_60)]">标签管理</h2>

      <form onSubmit={handleAdd} className="flex gap-3">
        <Input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="新标签名称"
          className="max-w-xs rounded-xl border-[oklch(0.88_0.04_50)]"
        />
        <Button
          type="submit"
          disabled={loading}
          className="text-white rounded-xl"
          style={{ backgroundImage: "var(--brand-gradient)" }}
        >
          {loading ? "添加中..." : "添加标签"}
        </Button>
      </form>

      {isLoading ? (
        <p className="text-[oklch(0.60_0.02_60)]">加载中...</p>
      ) : (
        <div className="space-y-2">
          {tags.map((tag, idx) => (
            <div
              key={tag.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[oklch(0.97_0.01_75)]"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveTag(tag, "up")}
                  disabled={idx === 0}
                  className="text-[oklch(0.50_0.02_60)] hover:text-[oklch(0.30_0.02_60)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer leading-none"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveTag(tag, "down")}
                  disabled={idx === tags.length - 1}
                  className="text-[oklch(0.50_0.02_60)] hover:text-[oklch(0.30_0.02_60)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer leading-none"
                >
                  ▼
                </button>
              </div>
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              <span className="font-medium text-[oklch(0.25_0.02_60)] flex-1">{tag.name}</span>
              <span className="text-xs text-[oklch(0.60_0.02_60)]">排序: {tag.sortOrder}</span>
              <button
                onClick={() => setDeleteTarget(tag)}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm transition-colors cursor-pointer"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="删除标签"
        description={`确定要删除标签「${deleteTarget?.name}」吗？使用此标签的商家将变为未分类。`}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
