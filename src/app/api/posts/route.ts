import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
    },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found. Please complete sign-up." }, { status: 404 });

  const body = await req.json();
  const { title, content, photos } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const created = await prisma.post.create({
    data: {
      userId,
      title,
      content,
      photos: photos ?? [],
    },
  });

  return NextResponse.json(created, { status: 201 });
}
