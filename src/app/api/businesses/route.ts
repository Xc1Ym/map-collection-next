import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessCreateSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  const visited = request.nextUrl.searchParams.get("visited");
  const search = request.nextUrl.searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (tag) where.tags = { some: { tag: { name: tag } } };
  if (visited === "true") where.visited = true;
  else if (visited === "false") where.visited = false;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  const businesses = await prisma.business.findMany({
    include: {
      tags: { include: { tag: true } },
    },
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: { createdAt: "desc" },
  });

  const result = businesses.map((b) => ({
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

  const { name, address, latitude, longitude, visited, rating, description, phone, website, tagIds } = parsed.data;

  const business = await prisma.business.create({
    data: {
      name,
      address,
      latitude,
      longitude,
      visited,
      rating: visited && rating != null ? rating : null,
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
