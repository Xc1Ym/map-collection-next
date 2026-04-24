"use client";

import type { Business } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TagBadge } from "@/components/tag/tag-badge";
import { StarRatingDisplay } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";

interface BusinessTableProps {
  businesses: Business[];
  onEdit: (business: Business) => void;
  onDelete: (id: number) => void;
}

export function BusinessTable({
  businesses,
  onEdit,
  onDelete,
}: BusinessTableProps) {
  if (businesses.length === 0) {
    return <p className="text-[oklch(0.60_0.02_60)] py-4">暂无商家数据</p>;
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
    <Table>
      <TableHeader>
        <TableRow className="border-b border-[oklch(0.91_0.02_75)]">
          <TableHead className="text-[oklch(0.45_0.02_60)]">商家名称</TableHead>
          <TableHead className="text-[oklch(0.45_0.02_60)]">状态</TableHead>
          <TableHead className="text-[oklch(0.45_0.02_60)]">评分</TableHead>
          <TableHead className="text-[oklch(0.45_0.02_60)]">分类</TableHead>
          <TableHead className="text-[oklch(0.45_0.02_60)]">地址</TableHead>
          <TableHead className="hidden md:table-cell text-[oklch(0.45_0.02_60)]">添加时间</TableHead>
          <TableHead className="text-[oklch(0.45_0.02_60)]">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses.map((b) => (
          <TableRow key={b.id} className="border-b border-[oklch(0.94_0.01_75)]">
            <TableCell className="font-medium text-[oklch(0.25_0.02_60)]">{b.name}</TableCell>
            <TableCell>
              {b.visited ? (
                <span className="rounded-full bg-[oklch(0.92_0.06_165)] px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.45_0.12_165)]">
                  ✓ 已吃
                </span>
              ) : (
                <span className="rounded-full bg-[oklch(0.95_0.02_75)] px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.55_0.02_60)]">
                  未吃
                </span>
              )}
            </TableCell>
            <TableCell>
              <StarRatingDisplay rating={b.rating} size={14} />
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {b.tags.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
              </div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-[oklch(0.50_0.02_60)]">{b.address}</TableCell>
            <TableCell className="hidden md:table-cell text-sm text-[oklch(0.55_0.02_60)]">
              {new Date(b.createdAt).toLocaleDateString("zh-CN")}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(b)}
                  className="rounded-xl border-[oklch(0.88_0.04_50)] text-[oklch(0.40_0.05_40)] hover:bg-[oklch(0.935_0.05_50)]"
                >
                  修改
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="rounded-xl"
                  onClick={() => onDelete(b.id)}
                >
                  删除
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
