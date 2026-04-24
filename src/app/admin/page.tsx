import { prisma } from "@/lib/prisma";
import { AdminPageClient } from "@/components/admin/admin-page-client";

export default async function AdminPage() {
  const businesses = await prisma.business.findMany({
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });

  const tags = await prisma.tag.findMany({ orderBy: { id: "asc" } });

  const formattedBusinesses = businesses.map((b) => ({
    id: b.id,
    name: b.name,
    address: b.address,
    latitude: Number(b.latitude),
    longitude: Number(b.longitude),
    visited: b.visited,
    rating: b.rating !== null ? Number(b.rating) : null,
    description: b.description,
    phone: b.phone,
    website: b.website,
    createdAt: b.createdAt.toISOString(),
    tags: b.tags.map((bt) => ({
      id: bt.tag.id,
      name: bt.tag.name,
      color: bt.tag.color,
    })),
  }));

  const formattedTags = tags.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
  }));

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-white/60">
      <AdminPageClient
        initialBusinesses={formattedBusinesses}
        tags={formattedTags}
      />
    </div>
  );
}
