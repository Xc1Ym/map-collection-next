import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessCreateSchema } from "@/lib/validations";

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
  const parsed = businessCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 }
    );
  }

  const { name, address, latitude, longitude, description, phone, website, tagIds } = parsed.data;

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
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json({ success: true, data: business });
}
