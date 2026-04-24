"use client";

import { useState } from "react";
import type { Business, Tag } from "@/types";
import { BusinessTable } from "@/components/business/business-table";
import { BusinessForm } from "@/components/business/business-form";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

interface AdminPageClientProps {
  initialBusinesses: Business[];
  tags: Tag[];
}

export function AdminPageClient({
  initialBusinesses,
  tags,
}: AdminPageClientProps) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [editBusiness, setEditBusiness] = useState<Business | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/businesses/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("商家删除成功");
        setBusinesses((prev) => prev.filter((b) => b.id !== deleteTarget.id));
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

  async function refreshBusinesses() {
    const res = await fetch("/api/businesses");
    const data = await res.json();
    if (data.success) setBusinesses(data.data);
    setEditBusiness(null);
    setShowAddForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold text-[oklch(0.25_0.02_60)]">商家列表 ({businesses.length}家)</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="text-white rounded-xl"
          style={{ backgroundImage: "var(--brand-gradient)" }}
        >
          添加商家
        </Button>
      </div>

      <BusinessTable
        businesses={businesses}
        onEdit={setEditBusiness}
        onDelete={(id) => {
          const target = businesses.find((b) => b.id === id);
          if (target) setDeleteTarget(target);
        }}
      />

      {(showAddForm || editBusiness) && (
        <BusinessForm
          tags={tags}
          editBusiness={editBusiness}
          onClose={() => {
            setEditBusiness(null);
            setShowAddForm(false);
          }}
          onSuccess={refreshBusinesses}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="删除商家"
        description={`确定要删除「${deleteTarget?.name}」吗？此操作不可恢复。`}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
