"use client";

import { useState } from "react";
import type { Business, Tag } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface BusinessFormProps {
  tags: Tag[];
  editBusiness?: Business | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BusinessForm({
  tags,
  editBusiness,
  onClose,
  onSuccess,
}: BusinessFormProps) {
  const [name, setName] = useState(editBusiness?.name || "");
  const [address, setAddress] = useState(editBusiness?.address || "");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    editBusiness?.tags?.map((t) => t.id) || []
  );
  const [loading, setLoading] = useState(false);

  const isEdit = !!editBusiness;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !address || selectedTagIds.length === 0) {
      toast.error("请填写所有必填字段并选择至少一个标签");
      return;
    }

    setLoading(true);

    try {
      const url = isEdit
        ? `/api/businesses/${editBusiness!.id}`
        : "/api/businesses";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          tagIds: selectedTagIds,
          // 新增时需要经纬度，编辑时可选
          ...(isEdit
            ? {}
            : {
                latitude: 34.261433,
                longitude: 108.946465,
              }),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(isEdit ? "商家更新成功" : "商家添加成功");
        onSuccess();
      } else {
        toast.error(data.error || "操作失败");
      }
    } catch {
      toast.error("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑商家" : "添加商家"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">商家名称</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入商家名称"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">地址</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="请输入地址"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">分类标签</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTagIds.includes(tag.id)
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={selectedTagIds.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                  />
                  <span className="text-sm font-medium" style={{ color: tag.color }}>
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "处理中..." : isEdit ? "保存修改" : "添加商家"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
