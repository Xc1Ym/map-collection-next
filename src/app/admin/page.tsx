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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <AdminPageClient
        initialBusinesses={formattedBusinesses}
        tags={formattedTags}
      />
    </div>
  );
}
