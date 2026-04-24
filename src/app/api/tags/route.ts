import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tagCreateSchema } from "@/lib/validations";

export async function GET() {
  const tags = await prisma.tag.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json({ success: true, data: tags });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = tagCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 }
    );
  }

  const { name, color } = parsed.data;

  try {
    const tag = await prisma.tag.create({ data: { name, color } });
    return NextResponse.json({ success: true, data: tag });
  } catch {
    return NextResponse.json({ error: "标签名称已存在" }, { status: 409 });
  }
}
