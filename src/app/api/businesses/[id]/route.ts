import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessUpdateSchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const business = await prisma.business.findUnique({
    where: { id: parseInt(id) },
    include: { tags: { include: { tag: true } } },
  });

  if (!business) {
    return NextResponse.json({ error: "商家不存在" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      ...business,
      latitude: Number(business.latitude),
      longitude: Number(business.longitude),
      tagIds: business.tags.map((bt) => bt.tagId),
      tags: business.tags.map((bt) => ({
        id: bt.tag.id,
        name: bt.tag.name,
        color: bt.tag.color,
      })),
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = businessUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 }
    );
  }

  const { name, address, latitude, longitude, description, phone, website, tagIds } = parsed.data;

  try {
    const business = await prisma.business.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address,
        ...(latitude != null && longitude != null ? { latitude, longitude } : {}),
        description,
        phone,
        website,
      },
    });

    if (tagIds) {
      await prisma.businessTag.deleteMany({ where: { businessId: business.id } });
      await prisma.businessTag.createMany({
        data: tagIds.map((tagId) => ({
          businessId: business.id,
          tagId,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "商家不存在或更新失败" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.business.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "商家不存在或删除失败" }, { status: 404 });
  }
}
