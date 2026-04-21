"use client";

import type { Business, Tag } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TagBadge } from "@/components/tag/tag-badge";
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
    return <p className="text-gray-400 py-4">暂无商家数据</p>;
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>商家名称</TableHead>
          <TableHead>分类</TableHead>
          <TableHead>地址</TableHead>
          <TableHead className="hidden md:table-cell">添加时间</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses.map((b) => (
          <TableRow key={b.id}>
            <TableCell className="font-medium">{b.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {b.tags.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
              </div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate">{b.address}</TableCell>
            <TableCell className="hidden md:table-cell text-sm text-gray-500">
              {new Date(b.createdAt).toLocaleDateString("zh-CN")}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(b)}>
                  修改
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
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
