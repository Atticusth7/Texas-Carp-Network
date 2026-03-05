import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await prisma.catch.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      gear: true,
      waterConditions: true,
    },
  });
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(c);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const c = await prisma.catch.findUnique({ where: { id } });
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (c.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.catch.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
