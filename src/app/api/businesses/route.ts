import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");

  const businesses = await prisma.business.findMany({
    include: {
      tags: { include: { tag: true } },
    },
    where: tag
      ? { tags: { some: { tag: { name: tag } } } }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  const result = businesses.map((b) => ({
    id: b.id,
    name: b.name,
    address: b.address,
    latitude: Number(b.latitude),
    longitude: Number(b.longitude),
    description: b.description,
    phone: b.phone,
    website: b.website,
    createdAt: b.createdAt,
    tags: b.tags.map((bt) => ({
      id: bt.tag.id,
      name: bt.tag.name,
      color: bt.tag.color,
    })),
  }));

  return NextResponse.json({ success: true, data: result });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, address, latitude, longitude, description, phone, website, tagIds } = body;

  if (!name || !address || !latitude || !longitude) {
    return NextResponse.json({ error: "请填写必填字段" }, { status: 400 });
  }

  const business = await prisma.business.create({
    data: {
      name,
      address,
      latitude,
      longitude,
      description,
      phone,
      website,
      tags: {
        create: (tagIds as number[]).map((tagId) => ({ tagId })),
      },
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json({ success: true, data: business });
}
