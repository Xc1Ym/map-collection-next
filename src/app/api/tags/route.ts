import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tags = await prisma.tag.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json({ success: true, data: tags });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, color } = body;

  if (!name) {
    return NextResponse.json({ error: "标签名称不能为空" }, { status: 400 });
  }

  try {
    const tag = await prisma.tag.create({
      data: { name, color: color || "#3498db" },
    });
    return NextResponse.json({ success: true, data: tag });
  } catch {
    return NextResponse.json({ error: "标签名称已存在" }, { status: 409 });
  }
}
