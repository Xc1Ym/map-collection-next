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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex justify-between items-center px-4 py-3 rounded-lg text-white"
              style={{ backgroundColor: tag.color }}
            >
              <span className="font-medium">{tag.name}</span>
              <button
                onClick={() => setDeleteTarget(tag)}
                className="bg-black/20 hover:bg-black/40 px-2 py-1 rounded text-xs transition-colors"
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
