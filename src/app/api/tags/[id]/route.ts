import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tagUpdateSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = tagUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 }
    );
  }

  try {
    const tag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, data: tag });
  } catch {
    return NextResponse.json({ error: "标签不存在或更新失败" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.tag.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "标签不存在或删除失败" }, { status: 404 });
  }
}
