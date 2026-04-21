import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, color } = body;

  try {
    const tag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: { ...(name && { name }), ...(color && { color }) },
    });
    return NextResponse.json({ success: true, data: tag });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
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
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
