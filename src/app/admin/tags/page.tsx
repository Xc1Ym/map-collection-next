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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <h2 className="text-xl font-semibold">标签管理</h2>

      <form onSubmit={handleAdd} className="flex gap-3">
        <Input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="新标签名称"
          className="max-w-xs"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "添加中..." : "添加标签"}
        </Button>
      </form>

      {isLoading ? (
        <p className="text-gray-400">加载中...</p>
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
