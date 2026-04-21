"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
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
import { AmapSearch } from "@/components/map/amap-search";
import { toast } from "sonner";

const AmapPicker = dynamic(
  () => import("@/components/map/amap-picker").then((m) => ({ default: m.AmapPicker })),
  { ssr: false }
);

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
  const [longitude, setLongitude] = useState(editBusiness?.longitude ?? 0);
  const [latitude, setLatitude] = useState(editBusiness?.latitude ?? 0);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    editBusiness?.tags?.map((t) => t.id) || []
  );
  const [loading, setLoading] = useState(false);
  const [locationSet, setLocationSet] = useState(!!editBusiness);

  const isEdit = !!editBusiness;

  const handleLocationSelect = useCallback(
    (lng: number, lat: number, addr: string) => {
      setLongitude(lng);
      setLatitude(lat);
      setLocationSet(true);
      if (addr) setAddress(addr);
    },
    []
  );

  const handleSearchSelect = useCallback(
    (result: { name: string; address: string; longitude: number; latitude: number }) => {
      setName(result.name);
      setAddress(result.name + " - " + result.address);
      setLongitude(result.longitude);
      setLatitude(result.latitude);
      setLocationSet(true);
    },
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !address || selectedTagIds.length === 0) {
      toast.error("请填写所有必填字段并选择至少一个标签");
      return;
    }

    if (!isEdit && !locationSet) {
      toast.error("请在地图上选择位置或使用搜索功能");
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
          longitude,
          latitude,
          tagIds: selectedTagIds,
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑商家" : "添加商家"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">搜索商家</label>
                <AmapSearch onSelect={handleSearchSelect} />
              </div>
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
                      <span
                        className="text-sm font-medium"
                        style={{ color: tag.color }}
                      >
                        {tag.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">地图选点</label>
              <AmapPicker onLocationSelect={handleLocationSelect} />
              {locationSet && (
                <p className="text-xs text-green-600">
                  已选择位置: {longitude.toFixed(6)}, {latitude.toFixed(6)}
                </p>
              )}
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
