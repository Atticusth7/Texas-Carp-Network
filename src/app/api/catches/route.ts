import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const catches = await prisma.catch.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      gear: true,
      waterConditions: true,
    },
  });
  return NextResponse.json(catches);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found. Please complete sign-up." }, { status: 404 });

  const body = await req.json();
  const { title, description, species, weightLbs, lengthIn, location, caughtAt, photos, gear, waterConditions } = body;

  if (!title || !species) {
    return NextResponse.json({ error: "Title and species are required" }, { status: 400 });
  }

  const created = await prisma.catch.create({
    data: {
      userId,
      title,
      description: description ?? null,
      species,
      weightLbs: weightLbs ?? null,
      lengthIn: lengthIn ?? null,
      location: location ?? null,
      caughtAt: caughtAt ? new Date(caughtAt) : new Date(),
      photos: photos ?? [],
      gear: gear?.length > 0 ? {
        create: gear.map((g: { type: string; brand?: string; model?: string; description?: string }) => ({
          type: g.type,
          brand: g.brand || null,
          model: g.model || null,
          description: g.description || null,
        })),
      } : undefined,
      waterConditions: waterConditions ? {
        create: {
          tempF: waterConditions.tempF ?? null,
          airTempF: waterConditions.airTempF ?? null,
          clarity: waterConditions.clarity ?? null,
          depthFt: waterConditions.depthFt ?? null,
          currentSpeed: waterConditions.currentSpeed ?? null,
          weather: waterConditions.weather ?? null,
          windMph: waterConditions.windMph ?? null,
          notes: waterConditions.notes ?? null,
        },
      } : undefined,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
